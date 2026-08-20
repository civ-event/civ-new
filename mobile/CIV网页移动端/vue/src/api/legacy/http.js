import axios from 'axios';
import { ErrorCode } from '../../utils/errorCodes';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  timeout: 30000,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.accessToken = token;
  }
  return config;
});

function mapLegacyError(payload, status) {
  const err = new Error(
    payload?.exception?.message
    || payload?.msg
    || payload?.message
    || (status ? `Request failed (${status})` : 'Request failed'),
  );

  const errorCode = payload?.exception?.error_code;
  if (payload?.code === 403 || status === 403) {
    err.code = ErrorCode.NOT_LOGGED_IN;
  } else if (errorCode === 400403 || errorCode === 400113) {
    err.code = ErrorCode.ACTIVITY_ENDED;
  } else {
    err.code = ErrorCode.UNKNOWN;
  }
  err.data = payload?.data;
  return err;
}

function unwrapLegacyResponse(payload, status) {
  if (payload == null || typeof payload !== 'object') {
    throw mapLegacyError({}, status);
  }

  // 如 GET /time/get-timestamp 直接返回 { time: N }
  if (payload.time != null && payload.code == null) {
    return payload;
  }

  // 如 login-and-bind-roles 直接返回 { user_info, roles, accessToken }，无 code 字段
  if (payload.code == null) {
    return payload;
  }

  if (payload.code === 0 || payload.code === 200) {
    return payload.data ?? payload;
  }

  throw mapLegacyError(payload, status);
}

function rethrowAxiosError(error) {
  if (axios.isAxiosError(error) && error.response) {
    const { data, status } = error.response;
    let payload = {};
    if (data && typeof data === 'object') {
      payload = data;
    } else if (typeof data === 'string' && data.trim()) {
      try {
        payload = JSON.parse(data);
      } catch {
        payload = { message: data.trim() };
      }
    }
    throw mapLegacyError(payload, status);
  }
  throw error;
}

async function runLegacyRequest(request) {
  try {
    return await request();
  } catch (error) {
    rethrowAxiosError(error);
  }
}

export async function legacyGet(url, params = {}, config = {}) {
  return runLegacyRequest(async () => {
    const response = await instance.get(url, {
      ...config,
      params: {
        ...params,
        t: Date.now(),
      },
    });
    return unwrapLegacyResponse(response.data, response.status);
  });
}

/** 可选接口：失败时返回 null，不抛错（如 time-config 配置不匹配时不影响主流程） */
export async function legacyGetOptional(url, params = {}, config = {}) {
  try {
    return await legacyGet(url, params, config);
  } catch {
    return null;
  }
}

export async function legacyPost(url, data = {}, config = {}) {
  return runLegacyRequest(async () => {
    const body = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        body.append(key, String(value));
      }
    });

    const response = await instance.post(url, body, {
      ...config,
      params: { t: Date.now() },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...(config.headers || {}),
      },
    });
    return unwrapLegacyResponse(response.data, response.status);
  });
}

export async function legacyPut(url, data = {}, config = {}) {
  return runLegacyRequest(async () => {
    const response = await instance.put(url, data, {
      ...config,
      headers: {
        ...(config.headers || {}),
      },
    });
    return unwrapLegacyResponse(response.data, response.status);
  });
}
