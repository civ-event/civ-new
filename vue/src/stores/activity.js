import { defineStore } from 'pinia';
import { fetchActivityInfo } from '../api/activity';
import { formatEventDurationRange } from '../utils/datetime';

export const useActivityStore = defineStore('activity', {
  state: () => ({
    loaded: false,
    status: null,
    startAt: null,
    endAt: null,
    timezone: 'UTC-5',
    serverTime: null,
  }),
  getters: {
    isActive: (state) => state.status === 'active',
    eventDurationText(state) {
      return formatEventDurationRange(
        state.startAt,
        state.endAt,
        '2025/2/1 - 2025/2/28 23:59 (Specific time TBD)',
      );
    },
  },
  actions: {
    async loadInfo() {
      const data = await fetchActivityInfo();
      this.status = data.status;
      this.startAt = data.startAt;
      this.endAt = data.endAt;
      this.timezone = data.timezone ?? 'UTC-5';
      this.serverTime = data.serverTime ?? null;
      this.loaded = true;
    },
  },
});
