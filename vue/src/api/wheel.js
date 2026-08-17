import request from './request';
import * as legacy from './legacy';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

/** 获取转盘信息（券数、奖品池） */
export function fetchWheelInfo() {
  if (useMock) return request.get('/wheel/info');
  return legacy.legacyFetchWheelInfo();
}

/** 抽奖 */
export function spinWheel(payload) {
  if (useMock) return request.post('/wheel/spin', payload);
  return legacy.legacySpinWheel(payload);
}

/** 抽奖券获得记录 */
export function fetchTicketHistory() {
  if (useMock) return request.get('/wheel/ticket-history');
  return legacy.legacyFetchTicketHistory();
}

/** 中奖记录 */
export function fetchWinHistory() {
  if (useMock) return request.get('/wheel/win-history');
  return legacy.legacyFetchWinHistory();
}
