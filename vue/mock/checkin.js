import { success, fail } from './_helpers.js';
import { ErrorCode } from './errorCodes.js';
import { requireRole } from './_guards.js';
import {
  buildCheckinStatus,
  getMockState,
  nowUtc5,
} from './_state.js';

function sortCheckinHistoryRecords(records = []) {
  return [...records].sort((a, b) => {
    const timeB = Date.parse(b.claimedAt ?? '');
    const timeA = Date.parse(a.claimedAt ?? '');
    const safeB = Number.isNaN(timeB) ? 0 : timeB;
    const safeA = Number.isNaN(timeA) ? 0 : timeA;
    return safeB - safeA;
  });
}

export default [
  {
    url: '/api/checkin/status',
    method: 'get',
    response: ({ headers }) => {
      const roleError = requireRole(headers);
      if (roleError) return roleError;
      return success(buildCheckinStatus());
    },
  },
  {
    url: '/api/checkin/daily',
    method: 'post',
    response: ({ headers }) => {
      const roleError = requireRole(headers);
      if (roleError) return roleError;

      const state = getMockState();
      if (state.todayChecked) {
        return fail(ErrorCode.ALREADY_CHECKED_IN);
      }
      if (state.checkedDays >= 10) {
        return fail(ErrorCode.CHECKIN_DAY_LOCKED, 'All daily rewards have been claimed.');
      }

      const nextDay = state.checkedDays + 1;
      const reward = state.dailyRewardsCatalog.find((item) => item.day === nextDay);
      if (!reward) {
        return fail(ErrorCode.UNKNOWN, 'Daily reward not found.');
      }

      state.checkedDays = nextDay;
      state.todayChecked = true;
      state.claimedDailyDays.push(nextDay);
      state.tickets += 3;
      state.checkinHistory.unshift({
        claimedAt: nowUtc5(),
        type: 'daily',
        rewardName: reward.name,
      });
      state.ticketHistory.unshift({
        obtainedAt: nowUtc5(),
        amount: 3,
        source: 'checkin',
      });

      return success({
        day: nextDay,
        ticketReward: 3,
        ticketsTotal: state.tickets,
        reward: {
          itemId: reward.itemId,
          name: reward.name,
          quantity: reward.quantity,
        },
        claimedAt: nowUtc5(),
      });
    },
  },
  {
    url: '/api/checkin/claim-milestone',
    method: 'post',
    response: ({ headers, body }) => {
      const roleError = requireRole(headers);
      if (roleError) return roleError;

      const days = Number(body?.days);
      if (![7, 10].includes(days)) {
        return fail(ErrorCode.UNKNOWN, 'Invalid milestone days.');
      }

      const state = getMockState();
      if (state.claimedMilestones.includes(days)) {
        return fail(ErrorCode.REWARD_ALREADY_CLAIMED);
      }
      if (state.checkedDays < days) {
        return fail(ErrorCode.MILESTONE_NOT_READY);
      }

      const reward = state.milestoneCatalog.find((item) => item.days === days);
      if (!reward) {
        return fail(ErrorCode.UNKNOWN, 'Milestone reward not found.');
      }

      state.claimedMilestones.push(days);
      state.checkinHistory.unshift({
        claimedAt: nowUtc5(),
        type: 'milestone',
        rewardName: reward.name,
        days,
      });

      return success({
        days,
        reward: {
          itemId: reward.itemId,
          name: reward.name,
          quantity: reward.quantity,
        },
        claimedAt: nowUtc5(),
      });
    },
  },
  {
    url: '/api/checkin/history',
    method: 'get',
    response: ({ headers }) => {
      const roleError = requireRole(headers);
      if (roleError) return roleError;

      const state = getMockState();
      return success({
        records: sortCheckinHistoryRecords(state.checkinHistory),
      });
    },
  },
];
