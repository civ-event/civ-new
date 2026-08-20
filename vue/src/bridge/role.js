import { callNative } from './bridge.js'
import { mapLegacyRole } from '../api/legacy/mappers.js'

/** 从 SDK 读取当前角色并映射为前端结构 */
export async function fetchSdkGameRole() {
  const raw = await callNative('getGameRole')
  if (!raw) return null

  let parsed = raw
  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw)
    } catch {
      return null
    }
  }

  return mapLegacyRole(parsed)
}