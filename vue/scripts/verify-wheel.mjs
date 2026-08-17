import assert from 'node:assert/strict';
import {
  WHEEL_PRIZE_INDEX,
  WHEEL_SEGMENT_DEG,
  computeSpinTargetRotation,
  getPrizeSegmentIndex,
  normalizeWheelRotation,
} from '../src/utils/wheelSpinAngles.js';

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    throw error;
  }
}

test('maps all 11 prize ids', () => {
  assert.equal(Object.keys(WHEEL_PRIZE_INDEX).length, 11);
  for (let index = 0; index < 11; index += 1) {
    const prizeId = Object.entries(WHEEL_PRIZE_INDEX).find(([, value]) => value === index)?.[0];
    assert.ok(prizeId, `missing prize for index ${index}`);
    assert.equal(getPrizeSegmentIndex(prizeId), index);
  }
});

test('normalizes rotation modulo 360', () => {
  assert.equal(normalizeWheelRotation(720), 0);
  assert.equal(normalizeWheelRotation(-90), 270);
  assert.equal(normalizeWheelRotation(1530), 90);
});

test('each prize lands on its segment center at 12 o clock', () => {
  for (const [prizeId, index] of Object.entries(WHEEL_PRIZE_INDEX)) {
    const target = computeSpinTargetRotation(0, prizeId);
    const normalized = normalizeWheelRotation(target);
    const expected = normalizeWheelRotation(360 - (index + 0.5) * WHEEL_SEGMENT_DEG);
    assert.ok(
      Math.abs(normalized - expected) < 0.001,
      `${prizeId} expected ${expected}, got ${normalized}`,
    );
  }
});

test('spin advances at least four full turns', () => {
  const target = computeSpinTargetRotation(0, 'p11');
  assert.ok(target >= 1440);
});

console.log('wheel angle verification passed');
