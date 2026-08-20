import request from './request';
import * as legacy from './legacy';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

/** 获取当前登录态 */
export function fetchSession() {
  if (useMock) return request.get('/user/session');
  return legacy.legacyFetchSession();
}

/** 登录 */
export function login(payload) {
  if (useMock) return request.post('/user/login', payload);
  return legacy.legacyLogin(payload);
}

/** 退出登录 */
export function logout() {
  if (useMock) return request.post('/user/logout');
  return legacy.legacyLogout();
}

/** 获取角色列表 */
export function fetchRoles() {
  if (useMock) return request.get('/user/roles');
  return legacy.legacyFetchRoles();
}

/** 选择角色 */
export function selectRole(payload) {
  if (useMock) return request.post('/user/select-role', payload);
  return legacy.legacySelectRole(payload);
}
