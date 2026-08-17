import request from './request';

/** 获取当前登录态 */
export function fetchSession() {
  return request.get('/user/session');
}

/** 登录（Mock / SDK 回调后刷新 session） */
export function login(payload) {
  return request.post('/user/login', payload);
}

/** 退出登录 */
export function logout() {
  return request.post('/user/logout');
}

/** 获取角色列表 */
export function fetchRoles() {
  return request.get('/user/roles');
}

/** 选择角色 */
export function selectRole(payload) {
  return request.post('/user/select-role', payload);
}
