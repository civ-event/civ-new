import { success, fail } from './_helpers.js';
import { ErrorCode } from './errorCodes.js';
import { WHEEL_PRIZES } from './_catalog.js';
import { requireRole } from './_guards.js';
import {
  getMockState,
  nowUtc5,
  pickWheelPrize,
  WHEEL_PRIZE_POOL,
} from './_state.js';

function sortWheelHistoryRecords(records = [], field = 'obtainedAt') {
  return [...records].sort((a, b) => {
    const timeB = Date.parse(b[field] ?? '');
    const timeA = Date.parse(a[field] ?? '');
    const safeB = Number.isNaN(timeB) ? 0 : timeB;
    const safeA = Number.isNaN(timeA) ? 0 : timeA;
    return safeB - safeA;
  });
}

export default [
  {
    url: '/api/wheel/info',
    method: 'get',
    response: ({ headers }) => {
      const roleError = requireRole(headers);
      if (roleError) return roleError;

      const state = getMockState();
      return success({
        tickets: state.tickets,
        grandPrizeWon: state.grandPrizeWon,
        prizes: WHEEL_PRIZE_POOL.map(({ prizeId, itemId, name, quantity, probability, isGrandPrize }) => ({
          prizeId,
          itemId,
          name,
          quantity,
          probability,
          isGrandPrize: Boolean(isGrandPrize),
        })),
      });
    },
  },
  {
    url: '/api/wheel/spin',
    method: 'post',
    response: ({ headers, body }) => {
      const roleError = requireRole(headers);
      if (roleError) return roleError;

      const times = Number(body?.times);
      if (![1, 10].includes(times)) {
        return fail(ErrorCode.INVALID_SPIN_TIMES);
      }

      const state = getMockState();
      if (state.tickets < times) {
        return fail(ErrorCode.INSUFFICIENT_TICKETS);
      }

      const results = [];
      for (let i = 0; i < times; i += 1) {
        const prize = pickWheelPrize();
        if (prize.isGrandPrize) {
          if (state.grandPrizeWon) {
            const fallback = WHEEL_PRIZES.find((item) => item.prizeId === 'p1');
            results.push({
              prizeId: fallback.prizeId,
              itemId: fallback.itemId,
              name: fallback.name,
              quantity: fallback.quantity,
            });
            continue;
          }
          state.grandPrizeWon = true;
        }

        results.push({
          prizeId: prize.prizeId,
          itemId: prize.itemId,
          name: prize.name,
          quantity: prize.quantity,
        });

        state.winHistory.unshift({
          wonAt: nowUtc5(),
          prizeName: prize.name,
          quantity: prize.quantity,
        });
      }

      state.tickets -= times;

      return success({
        times,
        results,
        ticketsLeft: state.tickets,
        spunAt: nowUtc5(),
      });
    },
  },
  {
    url: '/api/wheel/ticket-history',
    method: 'get',
    response: ({ headers }) => {
      const roleError = requireRole(headers);
      if (roleError) return roleError;

      const state = getMockState();
      return success({
        records: sortWheelHistoryRecords(state.ticketHistory, 'obtainedAt'),
      });
    },
  },
  {
    url: '/api/wheel/win-history',
    method: 'get',
    response: ({ headers }) => {
      const roleError = requireRole(headers);
      if (roleError) return roleError;

      const state = getMockState();
      return success({
        records: sortWheelHistoryRecords(state.winHistory, 'wonAt'),
      });
    },
  },
];
