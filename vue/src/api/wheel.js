import request from './request';

/** 获取转盘信息（券数、奖品池） */
export function fetchWheelInfo() {
  return request.get('/wheel/info');
}

/** 抽奖 */
export function spinWheel(payload) {
  return request.post('/wheel/spin', payload);
}

/** 抽奖券获得记录 */
export function fetchTicketHistory() {
  return request.get('/wheel/ticket-history');
}

/** 中奖记录 */
export function fetchWinHistory() {
  return request.get('/wheel/win-history');
}
