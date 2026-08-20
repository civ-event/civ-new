import { callNative, getBridgeType } from './bridge.js'
import { resolveAccessToken } from '../api/legacy/config.js'
import { ErrorCode } from '../utils/errorCodes.js'

/** 是否在 App WebView 内 */
export function isInGameKitWebView() {
  return getBridgeType() !== 'none'
}

/** 解析 SDK 返回的 token（可能是纯 JWT、JSON 或带引号字符串） */
export function normalizeSdkToken(raw) {
  if (raw == null || raw === '') return ''

  let text = String(raw).trim()
  if (
    (text.startsWith('"') && text.endsWith('"'))
    || (text.startsWith("'") && text.endsWith("'"))
  ) {
    text = text.slice(1, -1).trim()
  }

  if (text.startsWith('{') || text.startsWith('[')) {
    try {
      const parsed = JSON.parse(text)
      if (typeof parsed === 'string') return parsed.trim()
      if (parsed && typeof parsed === 'object') {
        return String(
          parsed.accessToken
          || parsed.token
          || parsed.playerToken
          || parsed.player_token
          || '',
        ).trim()
      }
    } catch {
      /* 按原始字符串继续 */
    }
  }

  return text
}

/** 优先 SDK Token，其次 URL / env / localStorage */
export async function resolveLoginToken() {
  if (isInGameKitWebView()) {
    const token = normalizeSdkToken(await callNative('getPlayerToken'))
    if (token) return token

    const err = new Error('SDK 未返回 playerToken，请先在游戏中登录账号')
    err.code = ErrorCode.NOT_LOGGED_IN
    throw err
  }
  return resolveAccessToken()
}
