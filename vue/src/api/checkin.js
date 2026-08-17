import request from './request';
import * as legacy from './legacy';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

/** 获取签到状态 */
export function fetchCheckinStatus() {
  if (useMock) return request.get('/checkin/status');
  return legacy.legacyFetchCheckinStatus();
}

/** 每日签到 */
export function dailyCheckin() {
  if (useMock) return request.post('/checkin/daily');
  return legacy.legacyDailyCheckin();
}

/** 领取累计签到奖励（7 / 10 天） */
export function claimCheckinMilestone(payload) {
  if (useMock) return request.post('/checkin/claim-milestone', payload);
  return legacy.legacyClaimCheckinMilestone(payload);
}

/** 签到领奖记录 */
export function fetchCheckinHistory() {
  if (useMock) return request.get('/checkin/history');
  return legacy.legacyFetchCheckinHistory();
}
