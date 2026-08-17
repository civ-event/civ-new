import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({
    loading: false,
    toast: null,
    toastTimer: null,
    characterModalVisible: false,
    rewardHistoryModalVisible: false,
    ticketHistoryModalVisible: false,
    winHistoryModalVisible: false,
    spinResultModalVisible: false,
  }),
  actions: {
    showLoading() {
      this.loading = true;
    },
    hideLoading() {
      this.loading = false;
    },
    openCharacterModal() {
      this.characterModalVisible = true;
    },
    closeCharacterModal() {
      this.characterModalVisible = false;
    },
    openRewardHistoryModal() {
      this.rewardHistoryModalVisible = true;
    },
    closeRewardHistoryModal() {
      this.rewardHistoryModalVisible = false;
    },
    openTicketHistoryModal() {
      this.ticketHistoryModalVisible = true;
    },
    closeTicketHistoryModal() {
      this.ticketHistoryModalVisible = false;
    },
    openWinHistoryModal() {
      this.winHistoryModalVisible = true;
    },
    closeWinHistoryModal() {
      this.winHistoryModalVisible = false;
    },
    openSpinResultModal() {
      this.spinResultModalVisible = true;
    },
    closeSpinResultModal() {
      this.spinResultModalVisible = false;
    },
    showToast(message, type = 'info') {
      if (this.toastTimer) {
        clearTimeout(this.toastTimer);
      }
      const id = Date.now();
      this.toast = { id, message, type };
      this.toastTimer = setTimeout(() => {
        if (this.toast?.id === id) {
          this.toast = null;
        }
        this.toastTimer = null;
      }, 3000);
    },
    clearToast() {
      if (this.toastTimer) {
        clearTimeout(this.toastTimer);
        this.toastTimer = null;
      }
      this.toast = null;
    },
  },
});
