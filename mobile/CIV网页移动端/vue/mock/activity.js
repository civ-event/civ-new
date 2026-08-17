import { success } from './_helpers.js';
import { getMockState, grantGameLoginTickets, nowUtc5, resetMockState } from './_state.js';

function sortCheckinHistoryRecords(records = []) {
  return [...records].sort((a, b) => {
    const timeB = Date.parse(b.claimedAt ?? '');
    const timeA = Date.parse(a.claimedAt ?? '');
    const safeB = Number.isNaN(timeB) ? 0 : timeB;
    const safeA = Number.isNaN(timeA) ? 0 : timeA;
    return safeB - safeA;
  });
}

/** @param {Record<string, unknown>} body */
export function applyMockScenario(body = {}) {
  const state = getMockState();

  if (body.preset === 'checkin_milestone_7') {
    state.checkedDays = 7;
    state.todayChecked = true;
    state.claimedDailyDays = [1, 2, 3, 4, 5, 6, 7];
    state.claimedMilestones = [];
    return state;
  }

  if (body.preset === 'checkin_milestone_10') {
    state.checkedDays = 10;
    state.todayChecked = true;
    state.claimedDailyDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    state.claimedMilestones = [];
    return state;
  }

  if (body.preset === 'wheel_spin_ready') {
    state.tickets = 20;
    return state;
  }

  if (body.preset === 'grant_login_tickets') {
    grantGameLoginTickets({ force: true });
    return state;
  }

  if (body.preset === 'topup_ready_999') {
    state.topupTotal = 999;
    state.claimedTopupTiers = [499];
    return state;
  }

  if (body.preset === 'topup_all_claimable') {
    state.topupTotal = 9999;
    state.claimedTopupTiers = [];
    return state;
  }

  if (body.activityStatus) state.activityStatus = body.activityStatus;
  if (typeof body.tickets === 'number') state.tickets = body.tickets;
  if (typeof body.topupTotal === 'number') state.topupTotal = body.topupTotal;
  if (Array.isArray(body.claimedTopupTiers)) {
    state.claimedTopupTiers = [...body.claimedTopupTiers];
  }

  if (typeof body.checkedDays === 'number') {
    state.checkedDays = body.checkedDays;
    if (Array.isArray(body.claimedDailyDays)) {
      state.claimedDailyDays = [...body.claimedDailyDays];
    } else {
      state.claimedDailyDays = Array.from({ length: body.checkedDays }, (_, index) => index + 1);
    }
  }

  if (typeof body.todayChecked === 'boolean') {
    state.todayChecked = body.todayChecked;
  }

  if (Array.isArray(body.claimedMilestones)) {
    state.claimedMilestones = [...body.claimedMilestones];
  }

  return state;
}

export default [
  {
    url: '/api/activity/info',
    method: 'get',
    response: () => {
      const state = getMockState();
      return success({
        status: state.activityStatus,
        startAt: '2025-02-01T00:00:00-05:00',
        endAt: '2025-02-28T23:59:59-05:00',
        timezone: 'UTC-5',
        serverTime: nowUtc5(),
      });
    },
  },
  {
    url: '/api/mock/reset',
    method: 'post',
    response: () => {
      resetMockState();
      return success({ ok: true });
    },
  },
  {
    url: '/api/mock/scenario',
    method: 'post',
    response: ({ body }) => {
      const payload = body ?? {};
      if (payload.preset === 'grant_login_tickets') {
        const result = grantGameLoginTickets({ force: true });
        return success({
          ok: true,
          ...result,
          tickets: result.ticketsTotal,
        });
      }
      applyMockScenario(payload);
      const state = getMockState();
      return success({ ok: true, tickets: state.tickets });
    },
  },
];
