/** 转盘共 11 格，指针固定在 12 点钟方向 */
export const WHEEL_SEGMENT_COUNT = 11;
export const WHEEL_SEGMENT_DEG = 360 / WHEEL_SEGMENT_COUNT;
/** 停点距离扇区边界至少这么多度，避免看起来卡在分界线上 */
export const WHEEL_STOP_INSET_DEG = 4;

/**
 * prizeId → 格索引（PNG 顺时针，0 = 12 点钟第一格）
 * 对照 wheel-disc.png 12 点起顺时针：
 * 0 优惠券 1 资源箱 2 贡品盘 3 普通毛刷 4 合同 5 粗糙毛刷
 * 6 优质黏土 7 玺戒 8 钻石 9 橄榄枝 10 地图/执照
 */
export const WHEEL_PRIZE_INDEX = {
  p11: 0,
  p7: 1,
  p9: 2,
  p3: 3,
  p5: 4,
  p1: 5,
  p8: 6,
  p6: 7,
  p10: 8,
  p2: 9,
  p4: 10,
};

/**
 * 各奖品图标在盘面上的实际角度（12 点为 0，顺时针）。
 * 从图标像素质心测得，不用等分格子中心，避免指针停在两个图标中间。
 */
export const WHEEL_PRIZE_ANGLE = {
  p11: 12.9,
  p7: 42.3,
  p9: 81.1,
  p3: 120.5,
  p5: 157.8,
  p1: 182.3,
  p8: 213.0,
  p6: 246.7,
  p10: 277.8,
  p2: 302.4,
  p4: 343.5,
};

const MIN_TURNS = 4;

/** @param {number} degrees */
export function normalizeWheelRotation(degrees) {
  return ((degrees % 360) + 360) % 360;
}

/** @param {string} prizeId */
export function getPrizeSegmentIndex(prizeId) {
  return WHEEL_PRIZE_INDEX[prizeId] ?? 0;
}

/**
 * 图标角度夹进所属扇区内部，避免贴在分界线上。
 * @param {number} angle
 */
export function clampPrizeAngleToSector(angle) {
  const normalized = normalizeWheelRotation(angle);
  const index = Math.min(
    WHEEL_SEGMENT_COUNT - 1,
    Math.floor(normalized / WHEEL_SEGMENT_DEG),
  );
  const start = index * WHEEL_SEGMENT_DEG;
  const end = start + WHEEL_SEGMENT_DEG;
  const min = start + WHEEL_STOP_INSET_DEG;
  const max = end - WHEEL_STOP_INSET_DEG;
  if (max <= min) {
    return start + WHEEL_SEGMENT_DEG / 2;
  }
  return Math.min(max, Math.max(min, normalized));
}

/** @param {string} prizeId */
export function getPrizeStopAngle(prizeId) {
  const fallbackIndex = getPrizeSegmentIndex(prizeId);
  const raw = WHEEL_PRIZE_ANGLE[prizeId] ?? (fallbackIndex + 0.5) * WHEEL_SEGMENT_DEG;
  return clampPrizeAngleToSector(raw);
}

/**
 * 计算顺时针旋转目标角，使指定奖品图标停到顶部指针下
 * @param {number} currentRotation
 * @param {string} prizeId
 */
export function computeSpinTargetRotation(currentRotation, prizeId) {
  const prizeAngle = getPrizeStopAngle(prizeId);
  const endAngle = normalizeWheelRotation(360 - prizeAngle);
  const currentNorm = normalizeWheelRotation(currentRotation);
  let delta = (endAngle - currentNorm + 360) % 360;
  if (delta === 0) {
    delta = 360;
  }
  const extraTurns = Math.floor(Math.random() * 3);
  const fullTurns = MIN_TURNS + extraTurns;
  return currentRotation + fullTurns * 360 + delta;
}
