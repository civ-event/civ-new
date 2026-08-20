import request from './request';
import * as legacy from './legacy';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

/** 获取活动基础信息（时间、状态） */
export function fetchActivityInfo() {
  if (useMock) return request.get('/activity/info');
  return legacy.legacyFetchActivityInfo();
}
