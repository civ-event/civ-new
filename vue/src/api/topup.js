import request from './request';
import * as legacy from './legacy';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

/** 获取累充进度 */
export function fetchTopupProgress() {
  if (useMock) return request.get('/topup/progress');
  return legacy.legacyFetchTopupProgress();
}

/** 领取档位奖励 */
export function claimTopupReward(payload) {
  if (useMock) return request.post('/topup/claim', payload);
  return legacy.legacyClaimTopupReward(payload);
}
