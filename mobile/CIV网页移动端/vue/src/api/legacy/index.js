import { ErrorCode } from '../../utils/errorCodes.js';
import {
  getLegacyTimeParam,
  legacyConfig,
  readUrlParams,
  resolveAccessToken,
  withSource,
} from './config.js';
import { legacyGet, legacyGetOptional, legacyPost, legacyPut } from './http.js';
import {
  applyRoleToCache,
  mapActivityInfo,
  mapCheckinHistory,
  mapCheckinStatus,
  mapDailyCheckinResult,
  mapMilestoneClaimResult,
  mapRolesList,
  mapSessionFromRole,
  mapSpinResult,
  mapTicketHistory,
  mapTopupClaimReward,
  mapTopupProgress,
  mapWheelInfo,
  mapWinHistory,
} from './mappers.js';
import {
  clearRoleCache,
  getActiveRoleContext,
  getRoleCache,
  restoreRoleCacheFromSession,
  setAccessToken,
  setBindedRoles,
  setRechargeInfo,
  setRole,
  setUserMeta,
} from './roleCache.js';

const time = () => getLegacyTimeParam();

function pickRoleFromLoginResponse(roles = [], roleId) {
  if (!roles.length) return null;
  if (roleId) {
    const matched = roles.find(
      (item) => String(item.roleId ?? item.role_id) === String(roleId),
    );
    if (matched) return matched;
  }
  return roles[0];
}

async function applyLoginAndBindRoles(accessToken, roleId) {
  const urlParams = readUrlParams();
  const data = await legacyPut('/oauth/login-and-bind-roles', {
    accessToken,
    roleId: roleId || urlParams.roleId || undefined,
    source: legacyConfig.source,
  });

  const token = data?.accessToken ?? accessToken;
  storeToken(token);
  setUserMeta({
    playerId: data?.user_info?.player_id,
    userName: data?.user_info?.username,
  });

  const roles = data?.roles ?? [];
  setBindedRoles(roles);
  const role = pickRoleFromLoginResponse(roles, roleId);
  if (role) {
    setRole(role);
  }
  return role;
}

async function restoreRoleViaLogin(accessToken) {
  const cachedRoleId = getRoleCache().role?.roleId ?? getRoleCache().role?.role_id;
  try {
    return await applyLoginAndBindRoles(accessToken, cachedRoleId);
  } catch {
    return getRoleCache().role ?? null;
  }
}

async function refreshRoleFromServer() {
  const data = await legacyGetOptional('/user/user-extend-info', withSource({ time: time() }));
  if (!data) {
    return getRoleCache().role ?? null;
  }
  const userInfo = data?.userInfo ?? data?.roles?.[0] ?? data;
  if (userInfo) {
    setRole(userInfo);
  }
  return userInfo;
}

async function refreshRechargeInfo() {
  const ctx = getActiveRoleContext();
  if (!ctx?.roleId) return null;

  const data = await legacyGet('/recharge/get-activity-period-record', withSource({
    time: time(),
    role_id: ctx.roleId,
    server_id: ctx.serverId,
    player_id: ctx.playerId,
    game_code: legacyConfig.gameCode,
  }, legacyConfig.oldSource));

  setRechargeInfo({
    total: data?.total_virtual_goods ?? 0,
    milestones: data?.milestones ?? [],
  });
  return data;
}

function ensureRoleContext() {
  const ctx = getActiveRoleContext();
  if (!ctx?.roleId) {
    const err = new Error('Please select a character first.');
    err.code = ErrorCode.NO_ROLE_SELECTED;
    throw err;
  }
  return ctx;
}

function storeToken(token) {
  if (token) {
    localStorage.setItem('accessToken', token);
    setAccessToken(token);
  }
}

// ── 活动 ──────────────────────────────────────────────

export async function legacyFetchActivityInfo() {
  const timestampRes = await legacyGetOptional('/time/get-timestamp', { time: time() }) ?? {};

  // time-config 依赖正确的 activity_id + gamecode，测试服配置不对时会 400，不应阻断登录/玩法
  let timeConfigRes = null;
  if (legacyConfig.source && legacyConfig.gameCode) {
    timeConfigRes = await legacyGetOptional('/activities/time-config', {
      gamecode: legacyConfig.gameCode,
      activity_id: legacyConfig.source,
    });
  }

  const timeConfig = timeConfigRes?.time_config ?? timeConfigRes ?? {};
  return mapActivityInfo(timeConfig, timestampRes);
}

// ── 用户 ──────────────────────────────────────────────

export async function legacyFetchSession() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    clearRoleCache();
    return mapSessionFromRole(null, null);
  }

  setAccessToken(token);
  restoreRoleCacheFromSession();

  try {
    const extendData = await legacyGetOptional(
      '/user/user-extend-info',
      withSource({ time: time() }),
    );

    let role = null;
    if (extendData) {
      role = extendData?.userInfo ?? extendData?.roles?.[0] ?? extendData;
      if (role) setRole(role);
    } else {
      // 测试服 user-extend-info 404：自动 re-login 拉取最新角色/签到/转盘状态
      role = await restoreRoleViaLogin(token);
      if (!role) {
        role = getRoleCache().role ?? null;
      }
    }

    await refreshRechargeInfo().catch(() => {});
    return mapSessionFromRole(role, token);
  } catch (err) {
    if (err?.code === ErrorCode.NOT_LOGGED_IN) {
      localStorage.removeItem('accessToken');
      clearRoleCache();
      return mapSessionFromRole(null, null);
    }
    const fallbackRole = getRoleCache().role ?? null;
    return mapSessionFromRole(fallbackRole, token);
  }
}

export async function legacyLogin(payload = {}) {
  const accessToken = resolveAccessToken(payload);
  if (!accessToken) {
    const err = new Error(
      '缺少登录凭证 accessToken。请在 URL 加上 ?player_token=xxx，或在 .env.development 配置 VITE_DEV_ACCESS_TOKEN。',
    );
    err.code = ErrorCode.NOT_LOGGED_IN;
    throw err;
  }

  const urlParams = readUrlParams();
  const roleId = payload.roleId || urlParams.roleId || undefined;
  await applyLoginAndBindRoles(accessToken, roleId);
  await refreshRechargeInfo().catch(() => {});

  return {
    token: localStorage.getItem('accessToken'),
    isLoggedIn: true,
  };
}

export async function legacyLogout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('civ_event_token');
  clearRoleCache();
  return { ok: true };
}

export async function legacyFetchRoles() {
  const cache = getRoleCache();
  if (cache.bindedRoles.length) {
    return { roles: mapRolesList(cache.bindedRoles) };
  }

  const data = await legacyGetOptional('/games/get-binded-roles', withSource({ time: time() }));
  const roles = data?.roles ?? [];
  if (roles.length) {
    setBindedRoles(roles);
    return { roles: mapRolesList(roles) };
  }

  const playerId = cache.playerId;
  if (!playerId) {
    return { roles: [] };
  }

  const allData = await legacyGetOptional(
    `/games/${legacyConfig.gameCode}/players/${playerId}/roles`,
    withSource({ time: time() }),
  );
  const allRoles = allData?.roles ?? allData ?? [];
  return { roles: mapRolesList(Array.isArray(allRoles) ? allRoles : []) };
}

export async function legacySelectRole({ roleId }) {
  const cache = getRoleCache();
  const bindedMatch = cache.bindedRoles.find(
    (item) => String(item.roleId ?? item.role_id) === String(roleId),
  );

  if (bindedMatch) {
    const roleData = await legacyPost('/user/change-user', withSource({
      time: time(),
      role_id: roleId,
      server_id: bindedMatch.serverId ?? bindedMatch.server_id,
    }));
    const role = roleData?.userInfo ?? roleData?.roles?.[0];
    setRole(role);
  } else {
    const rolesResp = await legacyFetchRoles();
    const picked = rolesResp.roles.find((item) => item.roleId === String(roleId));
    if (!picked) {
      const err = new Error('Character not found.');
      err.code = ErrorCode.NO_ROLE_SELECTED;
      throw err;
    }
    const roleData = await legacyPut('/games/bind-server', withSource({
      role_id: roleId,
      server_id: picked.serverId,
      server_name: picked.serverName,
    }));
    const role = roleData?.roles?.[0];
    setRole(role);
    setBindedRoles(roleData?.roles ?? (role ? [role] : []));
  }

  await refreshRechargeInfo().catch(() => {});
  const mapped = applyRoleToCache(getRoleCache().role);
  return { role: mapped };
}

// ── 签到 ──────────────────────────────────────────────

export async function legacyFetchCheckinStatus() {
  const role = await refreshRoleFromServer();
  ensureRoleContext();
  return mapCheckinStatus(role);
}

export async function legacyDailyCheckin() {
  const ctx = ensureRoleContext();
  const status = mapCheckinStatus(getRoleCache().role);
  const nextDay = status.checkedDays + 1;

  const data = await legacyPost('/check-in/queued-clock-in', withSource({
    time: time(),
    server_id: ctx.serverId,
    role_id: ctx.roleId,
    sub_type: nextDay,
  }));

  if (data?.roles?.[0]) {
    setRole(data.roles[0]);
  } else {
    await refreshRoleFromServer();
  }

  return mapDailyCheckinResult(data, nextDay);
}

export async function legacyClaimCheckinMilestone({ days }) {
  const ctx = ensureRoleContext();
  const data = await legacyPost('/games/get-by-check-in-num', withSource({
    time: time(),
    server_id: ctx.serverId,
    role_id: ctx.roleId,
    check_in_num: days,
  }));

  if (data?.roles?.[0]) {
    setRole(data.roles[0]);
  } else {
    await refreshRoleFromServer();
  }

  return mapMilestoneClaimResult(days);
}

export async function legacyFetchCheckinHistory() {
  const role = await refreshRoleFromServer();
  ensureRoleContext();
  return { records: mapCheckinHistory(role) };
}

// ── 转盘 ──────────────────────────────────────────────

export async function legacyFetchWheelInfo() {
  const role = await refreshRoleFromServer();
  ensureRoleContext();
  return mapWheelInfo(role);
}

export async function legacySpinWheel({ times }) {
  const ctx = ensureRoleContext();
  const data = await legacyPost('/games/lottery-submit', withSource({
    server_id: ctx.serverId,
    role_id: ctx.roleId,
    times,
  }));

  if (data?.roles?.[0]) {
    setRole(data.roles[0]);
  } else {
    await refreshRoleFromServer();
  }

  return mapSpinResult(data, times);
}

export async function legacyFetchTicketHistory() {
  const role = await refreshRoleFromServer();
  ensureRoleContext();
  return { records: mapTicketHistory(role) };
}

export async function legacyFetchWinHistory() {
  const role = await refreshRoleFromServer();
  ensureRoleContext();
  return { records: mapWinHistory(role) };
}

// ── 累充 ──────────────────────────────────────────────

export async function legacyFetchTopupProgress() {
  const data = await refreshRechargeInfo();
  ensureRoleContext();
  return mapTopupProgress(data ?? {});
}

export async function legacyClaimTopupReward({ amount }) {
  const ctx = ensureRoleContext();
  const data = await legacyPost('/recharge/get-activity-period-rewards', withSource({
    time: time(),
    server_id: ctx.serverId,
    role_id: ctx.roleId,
    player_id: ctx.playerId,
    game_code: legacyConfig.gameCode,
    level: amount,
  }, legacyConfig.oldSource));

  setRechargeInfo({
    total: data?.total_virtual_goods ?? getRoleCache().rechargeTotal,
    milestones: data?.milestones ?? getRoleCache().rechargeMilestones,
  });

  return mapTopupClaimReward(amount);
}
