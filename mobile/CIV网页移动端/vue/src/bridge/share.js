import { callNative, getBridgeType } from './bridge.js'
import { openExternalLink } from '../utils/links.js'

export async function shareToPlatform({ platform, text, url, image }) {
  if (getBridgeType() === 'none') {
    if (url) openExternalLink(url)
    return
  }

  await callNative('share', { platform, text, url, image })
}
