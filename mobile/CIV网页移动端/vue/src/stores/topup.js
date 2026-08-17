import { defineStore } from 'pinia';
import { claimTopupReward, fetchTopupProgress } from '../api/topup';

export const useTopupStore = defineStore('topup', {
  state: () => ({
    loaded: false,
    totalTopup: 0,
    tiers: [],
  }),
  getters: {
    tierStatusMap(state) {
      return Object.fromEntries(
        state.tiers.map((tier) => [tier.amount, tier.status]),
      );
    },
  },
  actions: {
    applyProgress(data) {
      this.totalTopup = data.totalTopup ?? 0;
      this.tiers = data.tiers ?? [];
      this.loaded = true;
    },
    async loadProgress() {
      const data = await fetchTopupProgress();
      this.applyProgress(data);
      return data;
    },
    async claimTier(amount) {
      const data = await claimTopupReward({ amount });
      await this.loadProgress();
      return data;
    },
    reset() {
      this.loaded = false;
      this.totalTopup = 0;
      this.tiers = [];
    },
  },
});
