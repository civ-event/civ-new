/** civ-event 测试服对接配置（对应 .env.development 中的 VITE_* 变量） */

export const legacyConfig = {
  source: import.meta.env.VITE_APP_SOURCE || '',
  oldSource: import.meta.env.VITE_APP_OLD_SOURCE || import.meta.env.VITE_APP_SOURCE || '',
  gameCode: import.meta.env.VITE_APP_GAME || 'mpopen',
  limitLevel: Number(import.meta.env.VITE_APP_LIMIT_LEVEL || 5),
  debugOffsetDays: import.meta.env.VITE_APP_DEBUG === 'true'
    ? Number(import.meta.env.VITE_APP_DEBUG_OFFSET_DAYS || 0)
    : 0,
};

/** 与 civ-event 一致的 time 参数（签到/部分接口防缓存） */
export function getLegacyTimeParam() {
  const base = Math.ceil(Date.now() / 1000);
  const offset = legacyConfig.debugOffsetDays * 86400;
  return base + offset;
}

export function withSource(params = {}, source = legacyConfig.source) {
  return { ...params, source };
}

export function readUrlParams() {
  if (typeof window === 'undefined') {
    return { playerToken: '', roleId: '', gameCode: '', serverId: '' };
  }
  const search = new URLSearchParams(window.location.search);
  return {
    playerToken: search.get('player_token') || '',
    roleId: search.get('role_id') || '',
    gameCode: search.get('game_code') || '',
    serverId: search.get('server_id') || '',
  };
}

export function resolveAccessToken(payload = {}) {
  return (
    payload.accessToken
    || readUrlParams().playerToken
    || import.meta.env.VITE_DEV_ACCESS_TOKEN
    || (typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : '')
    || ''
  );
}
