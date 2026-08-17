/** 累充档位金额（与 mock/_catalog TOPUP_TIERS 一致） */
export const TOPUP_TIER_AMOUNTS = [499, 999, 1999, 2999, 4999, 9999];

/**
 * 各档位在进度条 rect-2-2 上的填充宽度（px，相对 rect-2-2 左缘）
 *
 * item-2-row 共 7 个宝箱：第 1 个为起点，后 6 个对应 499→9999 档位。
 * 依据 progress-bg(left 18 + rect-2-2 left 20) 与 item-2-row(margin-left 11) 布局推算。
 */
const TIER_FILL_WIDTHS = [88, 191, 296, 398, 504, 611];
const MAX_FILL_WIDTH = 611;

/**
 * @param {number} totalTopup
 * @returns {number}
 */
export function calcTopupProgressFillWidth(totalTopup) {
  const total = Math.max(0, Number(totalTopup) || 0);
  if (total <= 0) return 0;

  const amounts = TOPUP_TIER_AMOUNTS;
  if (total >= amounts[amounts.length - 1]) {
    return MAX_FILL_WIDTH;
  }

  let prevAmount = 0;
  let prevWidth = 0;

  for (let index = 0; index < amounts.length; index += 1) {
    const amount = amounts[index];
    const width = TIER_FILL_WIDTHS[index];

    if (total <= amount) {
      const segmentRatio = (total - prevAmount) / (amount - prevAmount);
      return prevWidth + segmentRatio * (width - prevWidth);
    }

    prevAmount = amount;
    prevWidth = width;
  }

  return MAX_FILL_WIDTH;
}
