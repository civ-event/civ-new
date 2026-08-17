import { fail } from './_helpers.js';
import { ErrorCode } from './errorCodes.js';
import { getMockState, getSelectedRole } from './_state.js';

/**
 * @param {import('vite-plugin-mock').MockRequestOptions['headers']} headers
 */
function extractToken(headers = {}) {
  const authorization = headers.authorization || headers.Authorization;
  if (!authorization) return null;
  const match = String(authorization).match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

export function requireActivityActive() {
  const { activityStatus } = getMockState();
  if (activityStatus === 'not_started') {
    return fail(ErrorCode.ACTIVITY_NOT_STARTED);
  }
  if (activityStatus === 'ended') {
    return fail(ErrorCode.ACTIVITY_ENDED);
  }
  return null;
}

/**
 * @param {import('vite-plugin-mock').MockRequestOptions['headers']} headers
 */
export function requireAuth(headers) {
  const activityError = requireActivityActive();
  if (activityError) return activityError;

  const token = extractToken(headers);
  const state = getMockState();
  if (!token || token !== state.token) {
    return fail(ErrorCode.NOT_LOGGED_IN);
  }
  return null;
}

/**
 * @param {import('vite-plugin-mock').MockRequestOptions['headers']} headers
 */
export function requireRole(headers) {
  const authError = requireAuth(headers);
  if (authError) return authError;

  const role = getSelectedRole();
  if (!role) {
    return fail(ErrorCode.NO_ROLE_SELECTED);
  }
  if (role.level < 5) {
    return fail(ErrorCode.LEVEL_TOO_LOW);
  }
  return null;
}
