/**
 * 签到领奖记录按领取时间倒序（最新在前）。
 * 需求未强制排序，但「历史记录」常规展示为最新条目优先。
 * @param {Array<{ claimedAt: string }>} records
 */
export function sortCheckinHistoryRecords(records = []) {
  return [...records].sort((a, b) => {
    const timeB = Date.parse(b.claimedAt ?? '');
    const timeA = Date.parse(a.claimedAt ?? '');
    const safeB = Number.isNaN(timeB) ? 0 : timeB;
    const safeA = Number.isNaN(timeA) ? 0 : timeA;
    return safeB - safeA;
  });
}
