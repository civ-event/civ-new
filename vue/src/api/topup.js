import request from './request';

/** 获取累充进度 */
export function fetchTopupProgress() {
  return request.get('/topup/progress');
}

/** 领取档位奖励 */
export function claimTopupReward(payload) {
  return request.post('/topup/claim', payload);
}
