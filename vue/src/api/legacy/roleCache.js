/** 缓存最近一次从后端拉取的角色/用户信息，供各模块 mapper 复用 */

const cache = {
  accessToken: null,
  playerId: null,
  userName: null,
  role: null,
  bindedRoles: [],
  rechargeTotal: 0,
  rechargeMilestones: [],
};

export function getRoleCache() {
  return cache;
}

export function setAccessToken(token) {
  cache.accessToken = token || null;
}

export function setUserMeta({ playerId, userName } = {}) {
  if (playerId !== undefined) cache.playerId = playerId;
  if (userName !== undefined) cache.userName = userName;
}

export function setRole(role) {
  cache.role = role || null;
}

export function setBindedRoles(roles = []) {
  cache.bindedRoles = Array.isArray(roles) ? roles : [];
}

export function setRechargeInfo({ total, milestones } = {}) {
  if (total !== undefined) cache.rechargeTotal = total;
  if (milestones !== undefined) cache.rechargeMilestones = milestones;
}

export function getActiveRoleContext() {
  const role = cache.role;
  if (!role) return null;
  return {
    roleId: role.roleId,
    serverId: role.serverId,
    playerId: role.playerId || cache.playerId,
    gameCode: role.gameCode,
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
}
