import { success, fail } from './_helpers.js';
import { ErrorCode } from './errorCodes.js';
import {
  getMockState,
  getSelectedRole,
  selectRole,
  setAuthToken,
} from './_state.js';
import { requireAuth } from './_guards.js';

export default [
  {
    url: '/api/user/session',
    method: 'get',
    response: ({ headers }) => {
      const state = getMockState();
      const authorization = headers?.authorization || headers?.Authorization || '';
      const matched = String(authorization).match(/^Bearer\s+(.+)$/i);
      const token = matched?.[1] ?? null;
      const isLoggedIn = Boolean(token && token === state.token);

      return success({
        isLoggedIn,
        token: isLoggedIn ? token : null,
        role: isLoggedIn ? getSelectedRole() : null,
      });
    },
  },
  {
    url: '/api/user/login',
    method: 'post',
    response: () => {
      const token = `mock-token-${Date.now()}`;
      setAuthToken(token);
      const state = getMockState();
      state.selectedRoleId = null;
      return success({
        token,
        isLoggedIn: true,
      });
    },
  },
  {
    url: '/api/user/logout',
    method: 'post',
    response: () => {
      const state = getMockState();
      state.token = null;
      state.selectedRoleId = null;
      return success({ ok: true });
    },
  },
  {
    url: '/api/user/roles',
    method: 'get',
    response: ({ headers }) => {
      const authError = requireAuth(headers);
      if (authError) return authError;

      const state = getMockState();
      return success({
        roles: state.roles,
      });
    },
  },
  {
    url: '/api/user/select-role',
    method: 'post',
    response: ({ headers, body }) => {
      const authError = requireAuth(headers);
      if (authError) return authError;

      const state = getMockState();
      const role = state.roles.find((item) => item.roleId === body?.roleId);
      if (!role) {
        return fail(ErrorCode.UNKNOWN, 'Character not found.');
      }

      selectRole(role.roleId);
      return success({ role });
    },
  },
];
