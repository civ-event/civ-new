import {
  CHECKIN_DAILY_REWARDS,
  CHECKIN_MILESTONES,
  MOCK_ROLES,
  WHEEL_PRIZES,
} from './_catalog.js';

const MOCK_STATE_KEY = '__CIV_MOCK_STATE__';

function createInitialState() {
  return {
    activityStatus: 'active',
    token: null,
    selectedRoleId: null,
    tickets: 7,
    loginTicketGranted: true,
    grandPrizeWon: false,
    checkedDays: 3,
    todayChecked: false,
    claimedDailyDays: [1, 2, 3],
    claimedMilestones: [],
    topupTotal: 999,
    claimedTopupTiers: [],
    checkinHistory: [
      {
        claimedAt: '2025-02-01T12:00:00-05:00',
        type: 'daily',
        rewardName: 'Diamond x100',
      },
      {
        claimedAt: '2025-02-02T12:00:00-05:00',
        type: 'daily',
        rewardName: 'Rough Brush x50',
      },
      {
        claimedAt: '2025-02-03T12:00:00-05:00',
        type: 'daily',
        rewardName: 'Fine Clay x1',
      },
    ],
    ticketHistory: [
      {
        obtainedAt: '2025-02-01T12:00:00-05:00',
        amount: 3,
        source: 'checkin',
      },
      {
        obtainedAt: '2025-02-02T09:00:00-05:00',
        amount: 3,
        source: 'game_login',
      },
    ],
    winHistory: [
      {
        wonAt: '2025-02-02T15:30:00-05:00',
        prizeName: 'Rough Brush x30',
        quantity: 30,
      },
    ],
    roles: MOCK_ROLES.map((role) => ({ ...role })),
    dailyRewardsCatalog: CHECKIN_DAILY_REWARDS.map((item) => ({ ...item })),
    milestoneCatalog: CHECKIN_MILESTONES.map((item) => ({ ...item })),
  };
}

/** @returns {ReturnType<typeof createInitialState>} */
function resolveState() {
  const globalRef = globalThis;
  if (!globalRef[MOCK_STATE_KEY]) {
    globalRef[MOCK_STATE_KEY] = createInitialState();
  }
  return globalRef[MOCK_STATE_KEY];
}

export function getMockState() {
  return resolveState();
}

export function resetMockState() {
  globalThis[MOCK_STATE_KEY] = createInitialState();
  return globalThis[MOCK_STATE_KEY];
}

export function getSelectedRole() {
  const state = resolveState();
  if (!state.selectedRoleId) return null;
  return state.roles.find((role) => role.roleId === state.selectedRoleId) ?? null;
}

export function setAuthToken(token) {
  resolveState().token = token;
}

export function selectRole(roleId) {
  resolveState().selectedRoleId = roleId;
}

export function nowUtc5() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc - 5 * 3600000).toISOString().replace('Z', '-05:00');
}

/** 活动期间登录游戏发券：每次模拟发放 3 张 */
export const LOGIN_TICKET_AMOUNT = 3;

/**
 * 模拟 Pop Epoch 登录发券。开发环境允许重复发放，方便把券用完后再测。
 * @param {{ force?: boolean }} [options]
 */
export function grantGameLoginTickets(options = {}) {
  const state = resolveState();
  const force = options.force !== false;
  if (state.loginTicketGranted && !force) {
    return {
      granted: false,
      amount: 0,
      ticketsTotal: state.tickets,
      source: 'game_login',
    };
  }

  state.tickets += LOGIN_TICKET_AMOUNT;
  state.loginTicketGranted = true;
  state.ticketHistory.unshift({
    obtainedAt: nowUtc5(),
    amount: LOGIN_TICKET_AMOUNT,
    source: 'game_login',
  });

  return {
    granted: true,
    amount: LOGIN_TICKET_AMOUNT,
    ticketsTotal: state.tickets,
    source: 'game_login',
  };
}

export function buildCheckinStatus() {
  const state = resolveState();
  const dailyRewards = state.dailyRewardsCatalog.map((reward) => {
    let status = 'locked';
    if (state.claimedDailyDays.includes(reward.day)) {
      status = 'claimed';
    } else if (reward.day === state.checkedDays + 1 && !state.todayChecked) {
      status = 'claimable';
    } else if (reward.day <= state.checkedDays) {
      status = 'claimed';
    }
    return { ...reward, status };
  });

  const milestones = state.milestoneCatalog.map((milestone) => {
    let status = 'locked';
    if (state.claimedMilestones.includes(milestone.days)) {
      status = 'claimed';
    } else if (state.checkedDays >= milestone.days) {
      status = 'claimable';
    }
    return { ...milestone, status };
  });

  return {
    checkedDays: state.checkedDays,
    todayChecked: state.todayChecked,
    dailyRewards,
    milestones,
  };
}

export function pickWheelPrize() {
  const state = resolveState();
  const pool = state.grandPrizeWon
    ? WHEEL_PRIZES.filter((prize) => !prize.isGrandPrize)
    : WHEEL_PRIZES;

  const roll = Math.random();
  let acc = 0;
  for (const prize of pool) {
    acc += prize.probability;
    if (roll <= acc) return prize;
  }
  return pool[pool.length - 1];
}

export const WHEEL_PRIZE_POOL = WHEEL_PRIZES.map((item) => ({ ...item }));
