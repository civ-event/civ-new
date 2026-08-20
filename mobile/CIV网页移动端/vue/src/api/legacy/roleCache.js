/** 缓存最近一次从后端拉取的角色/用户信息，供各模块 mapper 复用 */

const SESSION_STORAGE_KEY = 'civ_legacy_role_cache';

const cache = {
  accessToken: null,
  playerId: null,
  userName: null,
  role: null,
  bindedRoles: [],
  rechargeTotal: 0,
  rechargeMilestones: [],
};

function canUseSessionStorage() {
  return typeof sessionStorage !== 'undefined';
}

function persistRoleCache() {
  if (!canUseSessionStorage()) return;
  try {
    const payload = {
      playerId: cache.playerId,
      userName: cache.userName,
      role: cache.role,
      bindedRoles: cache.bindedRoles,
    };
    if (!payload.role && !payload.bindedRoles.length && !payload.playerId) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return;
    }
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // private mode / quota exceeded
  }
}

/** 刷新页面时从 sessionStorage 恢复角色（user-extend-info 404 时的本地兜底） */
export function restoreRoleCacheFromSession() {
  if (!canUseSessionStorage()) return false;
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (data.playerId !== undefined) cache.playerId = data.playerId;
    if (data.userName !== undefined) cache.userName = data.userName;
    if (data.role) cache.role = data.role;
    if (Array.isArray(data.bindedRoles)) cache.bindedRoles = data.bindedRoles;
    return Boolean(cache.role);
  } catch {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    return false;
  }
}

export function getRoleCache() {
  return cache;
}

export function setAccessToken(token) {
  cache.accessToken = token || null;
}

export function setUserMeta({ playerId, userName } = {}) {
  if (playerId !== undefined) cache.playerId = playerId;
  if (userName !== undefined) cache.userName = userName;
  persistRoleCache();
}

export function setRole(role) {
  cache.role = role || null;
  persistRoleCache();
}

export function setBindedRoles(roles = []) {
  cache.bindedRoles = Array.isArray(roles) ? roles : [];
  persistRoleCache();
}

export function setRechargeInfo({ total, milestones } = {}) {
  if (total !== undefined) cache.rechargeTotal = total;
  if (milestones !== undefined) cache.rechargeMilestones = milestones;
}

export function getActiveRoleContext() {
  const role = cache.role;
  if (!role) return null;
  return {
    roleId: role.roleId ?? role.role_id,
    serverId: role.serverId ?? role.server_id,
    playerId: role.playerId ?? role.player_id ?? cache.playerId,
    gameCode: role.gameCode ?? role.game_code,
  };
}

export function clearRoleCache() {
  cache.accessToken = null;
  cache.playerId = null;
  cache.userName = null;
  cache.role = null;
  cache.bindedRoles = [];
  cache.rechargeTotal = 0;
  cache.rechargeMilestones = [];
  if (canUseSessionStorage()) {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  }
}
