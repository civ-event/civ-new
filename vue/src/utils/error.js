import { i18n } from '../i18n';
import { ErrorI18nKey, getErrorMessageByCode } from './errorCodes.js';

function translateErrorCode(code) {
  const key = ErrorI18nKey[code];
  if (!key) return '';
  try {
    return i18n.global.t(key);
  } catch {
    return getErrorMessageByCode(code);
  }
}

/**
 * @param {unknown} error
 * @param {string} [fallback]
 */
export function getErrorMessage(error, fallback) {
  const defaultFallback = fallback ?? translateErrorCode(1) ?? 'Something went wrong. Please try again.';
  if (!error) return defaultFallback;

  if (typeof error === 'string') return error;

  if (typeof error === 'object' && error !== null) {
    if ('msg' in error && typeof error.msg === 'string' && error.msg.trim()) {
      return error.msg;
    }
    if ('message' in error && typeof error.message === 'string' && error.message.trim()) {
      return error.message;
    }
  }

  const code = getErrorCode(error);
  if (typeof code === 'number') {
    const translated = translateErrorCode(code);
    if (translated) return translated;
  }

  return defaultFallback;
}

/**
 * @param {unknown} error
 */
export function isApiError(error) {
  return Boolean(error && typeof error === 'object' && typeof error.code === 'number');
}

/**
 * @param {unknown} error
 */
export function getErrorCode(error) {
  if (isApiError(error)) return error.code;
  return undefined;
}
