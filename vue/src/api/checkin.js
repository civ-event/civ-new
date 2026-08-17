import request from './request';

/** 获取签到状态 */
export function fetchCheckinStatus() {
  return request.get('/checkin/status');
}

/** 每日签到 */
export function dailyCheckin() {
  return request.post('/checkin/daily');
}

/** 领取累计签到奖励（7 / 10 天） */
export function claimCheckinMilestone(payload) {
  return request.post('/checkin/claim-milestone', payload);
}

/** 签到领奖记录 */
export function fetchCheckinHistory() {
  return request.get('/checkin/history');
}
