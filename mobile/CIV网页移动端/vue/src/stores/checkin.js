import { defineStore } from 'pinia';
import {
  claimCheckinMilestone,
  dailyCheckin,
  fetchCheckinHistory,
  fetchCheckinStatus,
} from '../api/checkin';
import { sortCheckinHistoryRecords } from '../utils/checkinHistory';

export const useCheckinStore = defineStore('checkin', {
  state: () => ({
    loaded: false,
    checkedDays: 0,
    todayChecked: false,
    dailyRewards: [],
    milestones: [],
    history: [],
  }),
  getters: {
    progressPercent(state) {
      return Math.min(100, (state.checkedDays / 10) * 100);
    },
    milestone7(state) {
      return state.milestones.find((item) => item.days === 7) ?? null;
    },
    milestone10(state) {
      return state.milestones.find((item) => item.days === 10) ?? null;
    },
    dayStatusMap(state) {
      return Object.fromEntries(
        state.dailyRewards.map((reward) => [reward.day, reward.status]),
      );
    },
  },
  actions: {
    applyStatus(data) {
      this.checkedDays = data.checkedDays ?? 0;
      this.todayChecked = Boolean(data.todayChecked);
      this.dailyRewards = data.dailyRewards ?? [];
      this.milestones = data.milestones ?? [];
      this.loaded = true;
    },
    async loadStatus() {
      const data = await fetchCheckinStatus();
      this.applyStatus(data);
      return data;
    },
    async checkinDaily() {
      const data = await dailyCheckin();
      await this.loadStatus();
      return data;
    },
    async claimMilestone(days) {
      const data = await claimCheckinMilestone({ days });
      await this.loadStatus();
      return data;
    },
    async loadHistory() {
      const data = await fetchCheckinHistory();
      this.history = sortCheckinHistoryRecords(data.records ?? []);
      return this.history;
    },
    reset() {
      this.loaded = false;
      this.checkedDays = 0;
      this.todayChecked = false;
      this.dailyRewards = [];
      this.milestones = [];
      this.history = [];
    },
  },
});
