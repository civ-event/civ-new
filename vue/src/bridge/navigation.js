import { callNative, getBridgeType } from './bridge.js'
import { openExternalLink } from '../utils/links.js'

export async function openUrl(url) {
  if (!url) return

  const type = getBridgeType()
  if (type === 'kmp') {
    await callNative('openExternalUrl', url)
    return
  }

  // Android/iOS 旧版或无 Bridge：浏览器兜底
  openExternalLink(url)
}

export async function closeWebView() {
  if (getBridgeType() === 'none') {
    window.history.back()
    return
  }
  await callNative('closeWebView')
}