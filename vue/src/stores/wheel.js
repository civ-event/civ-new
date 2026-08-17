import { defineStore } from 'pinia';
import {
  fetchTicketHistory,
  fetchWheelInfo,
  fetchWinHistory,
  spinWheel,
} from '../api/wheel';
import { sortWheelHistoryRecords } from '../utils/wheelHistory';

export const useWheelStore = defineStore('wheel', {
  state: () => ({
    loaded: false,
    tickets: 0,
    grandPrizeWon: false,
    prizes: [],
    ticketHistory: [],
    winHistory: [],
    lastSpinResults: [],
    lastSpunAt: null,
  }),
  actions: {
    async loadInfo() {
      const data = await fetchWheelInfo();
      this.tickets = data.tickets ?? 0;
      this.grandPrizeWon = Boolean(data.grandPrizeWon);
      this.prizes = data.prizes ?? [];
      this.loaded = true;
      return data;
    },
    async spin(times) {
      const data = await spinWheel({ times });
      this.tickets = data.ticketsLeft ?? this.tickets;
      this.lastSpinResults = data.results ?? [];
      this.lastSpunAt = data.spunAt ?? null;
      if (this.lastSpinResults.some((item) => item.name?.includes('Top-Up Coupon'))) {
        this.grandPrizeWon = true;
      }
      return data;
    },
    async loadTicketHistory() {
      const data = await fetchTicketHistory();
      this.ticketHistory = sortWheelHistoryRecords(data.records ?? [], 'obtainedAt');
      return this.ticketHistory;
    },
    async loadWinHistory() {
      const data = await fetchWinHistory();
      this.winHistory = sortWheelHistoryRecords(data.records ?? [], 'wonAt');
      return this.winHistory;
    },
    setTickets(tickets) {
      this.tickets = tickets;
    },
    reset() {
      this.loaded = false;
      this.tickets = 0;
      this.grandPrizeWon = false;
      this.prizes = [];
      this.ticketHistory = [];
      this.winHistory = [];
      this.lastSpinResults = [];
      this.lastSpunAt = null;
    },
  },
});
