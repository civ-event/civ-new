/**
 * GameKit JS Bridge 统一适配层
 * 支持：
 * 1) 新版 KMP Compose WebView：window.kmpJsBridge.callNative
 * 2) Android 旧版：WebViewJavascriptBridge.callHandler
 * 3) iOS 旧版：webkit.messageHandlers + setXxx / shareCallback 回调
 */

const IOS_SET_CALLBACKS = {
  getPlayerToken: 'setPlayerToken',
  getPlayerInfo: 'setPlayerInfo',
  getGameRole: 'setGameRole',
  getClientInfo: 'setClientInfo',
  getCustomerServiceExtend: 'setCustomerServiceExtend',
  getAgreement: 'setAgreement',
  getAlbumImage: 'setAlbumImage',
  CallOcCopy: 'CallOcCopy',
  share: 'shareCallback',
}

/** @type {'kmp' | 'android' | 'ios' | 'none'} */
let cachedType = null
let androidBridgeReady = null

export function detectBridgeType() {
  if (window.kmpJsBridge && typeof window.kmpJsBridge.callNative === 'function') {
    return 'kmp'
  }
  if (window.WebViewJavascriptBridge || window.WVJBCallbacks) {
    return 'android'
  }
  if (window.webkit?.messageHandlers) {
    return 'ios'
  }
  return 'none'
}

export function getBridgeType() {
  cachedType = detectBridgeType()
  return cachedType
}

export function getBridgeLabel(type = getBridgeType()) {
  switch (type) {
    case 'kmp':
      return 'KMP Compose (kmpJsBridge)'
    case 'android':
      return 'Android Legacy (jsbridge)'
    case 'ios':
      return 'iOS Legacy (webkit.messageHandlers)'
    default:
      return '未检测到 Bridge（浏览器预览模式）'
  }
}

function setupAndroidBridge() {
  if (androidBridgeReady) return androidBridgeReady
  androidBridgeReady = new Promise((resolve) => {
    if (window.WebViewJavascriptBridge) {
      resolve(window.WebViewJavascriptBridge)
      return
    }
    if (window.WVJBCallbacks) {
      window.WVJBCallbacks.push(resolve)
      return
    }
    window.WVJBCallbacks = [resolve]
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = 'https://__bridge_loaded__'
    document.documentElement.appendChild(iframe)
    setTimeout(() => {
      iframe.parentNode?.removeChild(iframe)
    }, 0)
    // 超时兜底，避免一直挂起
    setTimeout(() => {
      resolve(window.WebViewJavascriptBridge || null)
    }, 1500)
  })
  return androidBridgeReady
}

function normalizeParams(params) {
  if (params == null || params === '') return ''
  if (typeof params === 'string') return params
  return JSON.stringify(params)
}

function waitForGlobalCallback(callbackName, timeoutMs = 12000) {
  return new Promise((resolve, reject) => {
    const previous = window[callbackName]
    let settled = false

    const timer = setTimeout(() => {
      if (settled) return
      settled = true
      if (previous) {
        window[callbackName] = previous
      } else {
        delete window[callbackName]
      }
      reject(new Error(`等待回调超时: ${callbackName}`))
    }, timeoutMs)

    window[callbackName] = function (data) {
      if (settled) return
      settled = true
      clearTimeout(timer)
      if (typeof previous === 'function') {
        window[callbackName] = previous
        try {
          previous(data)
        } catch (_) {
          /* ignore */
        }
      } else {
        delete window[callbackName]
      }
      resolve(data == null ? '' : String(data))
    }
  })
}

async function callKmp(method, params) {
  return new Promise((resolve, reject) => {
    try {
      window.kmpJsBridge.callNative(method, normalizeParams(params), (result) => {
        resolve(result == null ? '' : String(result))
      })
    } catch (e) {
      reject(e)
    }
  })
}

async function callAndroid(method, params) {
  const bridge = await setupAndroidBridge()
  if (!bridge || typeof bridge.callHandler !== 'function') {
    throw new Error('WebViewJavascriptBridge 不可用')
  }
  return new Promise((resolve, reject) => {
    try {
      bridge.callHandler(method, normalizeParams(params), (responseData) => {
        resolve(responseData == null ? '' : String(responseData))
      })
    } catch (e) {
      reject(e)
    }
  })
}

/** 分享含图片下载 + Instagram Open-In 用户操作，旧版 iOS 回调需更长等待 */
const IOS_CALLBACK_TIMEOUT_MS = {
  share: 90_000,
}

async function callIos(method, params) {
  const handler = window.webkit?.messageHandlers?.[method]
  if (!handler || typeof handler.postMessage !== 'function') {
    throw new Error(`iOS messageHandler 不存在: ${method}`)
  }

  const callbackName = IOS_SET_CALLBACKS[method]
  const payload = params == null || params === '' ? '' : normalizeParams(params)

  // 无回调方法：直接 postMessage
  if (!callbackName) {
    handler.postMessage(payload)
    return { ok: true, note: '已发送（无返回值）' }
  }

  const timeoutMs = IOS_CALLBACK_TIMEOUT_MS[method] ?? 12_000
  const pending = waitForGlobalCallback(callbackName, timeoutMs)
  handler.postMessage(payload)
  return pending
}

/**
 * 统一调用入口
 * @param {string} method
 * @param {string|object} [params]
 * @returns {Promise<any>}
 */
export async function callNative(method, params = '') {
  const type = getBridgeType()
  switch (type) {
    case 'kmp':
      return callKmp(method, params)
    case 'android':
      return callAndroid(method, params)
    case 'ios':
      return callIos(method, params)
    default:
      throw new Error('当前环境没有可用的 JS Bridge，请在 Pop Epoch 游戏内 WebView 中打开')
  }
}

/** 探测当前环境支持的 handler（尽力而为） */
export function probeCapabilities() {
  const type = getBridgeType()
  const common = [
    'closeWebView',
    'getPlayerToken',
    'getPlayerInfo',
    'getGameRole',
    'getClientInfo',
    'getCustomerServiceExtend',
    'getAgreement',
    'showRepayPage',
    'share',
  ]

  if (type === 'kmp') {
    return {
      type,
      methods: [...common, 'openExternalUrl'],
    }
  }
  if (type === 'android') {
    return {
      type,
      methods: [...common, 'getAlbumImage'],
    }
  }
  if (type === 'ios') {
    return {
      type,
      methods: [...common, 'getAlbumImage', 'CallOcCopy'],
    }
  }
  return {
    type: 'none',
    methods: [...common, 'openExternalUrl', 'getAlbumImage', 'CallOcCopy'],
  }
}

export function startBridgeWatch(onChange) {
  let last = getBridgeType()
  onChange(last)
  const timer = setInterval(() => {
    const next = detectBridgeType()
    if (next !== last) {
      last = next
      cachedType = next
      onChange(next)
    }
  }, 800)
  return () => clearInterval(timer)
}
