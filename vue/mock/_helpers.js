import { ErrorCode, getErrorMessageByCode } from './errorCodes.js';

/** @returns {{ code: number, data: unknown, msg: string }} */
export function success(data) {
  return {
    code: ErrorCode.SUCCESS,
    data,
    msg: 'ok',
  };
}

/** @returns {{ code: number, data: null, msg: string }} */
export function fail(code, msg) {
  return {
    code,
    data: null,
    msg: msg ?? getErrorMessageByCode(code),
  };
}
