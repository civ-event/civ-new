import request from './request';

/** 仅开发环境：重置 Mock 内存状态 */
export function resetMockState() {
  if (!import.meta.env.DEV) {
    return Promise.reject(new Error('resetMockState is only available in development.'));
  }
  return request.post('/mock/reset');
}

/** 仅开发环境：切换 Mock 场景 */
export function setMockScenario(scenario) {
  if (!import.meta.env.DEV) {
    return Promise.reject(new Error('setMockScenario is only available in development.'));
  }
  return request.post('/mock/scenario', scenario);
}

/** 开发环境：预设为累计签到 7 天，可测 7 天里程碑 */
export function mockCheckinMilestone7() {
  return setMockScenario({ preset: 'checkin_milestone_7' });
}

/** 开发环境：预设为累计签到 10 天，7/10 天里程碑均可领取 */
export function mockCheckinMilestone10() {
  return setMockScenario({ preset: 'checkin_milestone_10' });
}

/** 开发环境：预设 20 张抽奖券，便于测试 Spin x1/x10 */
export function mockWheelSpinReady() {
  return setMockScenario({ preset: 'wheel_spin_ready' });
}

/** 开发环境：模拟游戏登录发放 3 张抽奖券（Ticket History 来源为 Game Login） */
export async function mockGrantLoginTickets() {
  const data = await setMockScenario({ preset: 'grant_login_tickets' });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('civ-dev-mock-updated', { detail: data }));
  }
  return data;
}

/** 开发环境：累充 999，499 已领，999 可领 */
export function mockTopupReady999() {
  return setMockScenario({ preset: 'topup_ready_999' });
}

/** 开发环境：累充 9999，全部档位可领 */
export function mockTopupAllClaimable() {
  return setMockScenario({ preset: 'topup_all_claimable' });
}
