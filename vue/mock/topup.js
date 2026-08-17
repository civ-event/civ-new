import { success, fail } from './_helpers.js';
import { ErrorCode } from './errorCodes.js';
import { TOPUP_TIERS } from './_catalog.js';
import { requireRole } from './_guards.js';
import { getMockState, nowUtc5 } from './_state.js';

export default [
  {
    url: '/api/topup/progress',
    method: 'get',
    response: ({ headers }) => {
      const roleError = requireRole(headers);
      if (roleError) return roleError;

      const state = getMockState();
      const tiers = TOPUP_TIERS.map((tier) => {
        let status = 'locked';
        if (state.claimedTopupTiers.includes(tier.amount)) {
          status = 'claimed';
        } else if (state.topupTotal >= tier.amount) {
          status = 'claimable';
        }
        return { ...tier, status };
      });

      return success({
        totalTopup: state.topupTotal,
        tiers,
      });
    },
  },
  {
    url: '/api/topup/claim',
    method: 'post',
    response: ({ headers, body }) => {
      const roleError = requireRole(headers);
      if (roleError) return roleError;

      const amount = Number(body?.amount);
      const tier = TOPUP_TIERS.find((item) => item.amount === amount);
      if (!tier) {
        return fail(ErrorCode.INVALID_TOPUP_TIER);
      }

      const state = getMockState();
      if (state.claimedTopupTiers.includes(amount)) {
        return fail(ErrorCode.TOPUP_ALREADY_CLAIMED);
      }
      if (state.topupTotal < amount) {
        return fail(ErrorCode.TOPUP_TIER_NOT_REACHED);
      }

      state.claimedTopupTiers.push(amount);
      return success({
        amount,
        reward: {
          itemId: tier.itemId,
          name: tier.name,
          quantity: tier.quantity,
        },
        claimedAt: nowUtc5(),
      });
    },
  },
];
