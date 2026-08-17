import { onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useUiStore } from '../stores/ui';
import { useUserStore } from '../stores/user';
import { useWheelStore } from '../stores/wheel';
import { getErrorMessage } from '../utils/error';
import { useParticipateGuard } from './useParticipateGuard';

import { useWheelSpinAnimation } from './useWheelSpinAnimation';

export function useWheelActions() {
  const uiStore = useUiStore();
  const userStore = useUserStore();
  const wheelStore = useWheelStore();
  const { ensureCanParticipate, t } = useParticipateGuard();
  const { tickets } = storeToRefs(wheelStore);
  const { wheelRotation, isWheelSpinning, rotatorRef, playSpinAnimation } = useWheelSpinAnimation();

  async function refreshWheelInfo() {
    if (!userStore.canParticipate) {
      wheelStore.reset();
      return;
    }

    try {
      await wheelStore.loadInfo();
    } catch (error) {
      console.error('[wheel] failed to load info', error);
      uiStore.showToast(getErrorMessage(error), 'error');
    }
  }

  async function handleSpin(times) {
    if (!(await ensureCanParticipate())) return;

    if (isWheelSpinning.value) return;

    if (tickets.value < times) {
      uiStore.showToast(t('errors.notEnoughTickets'), 'error');
      return;
    }

    try {
      const data = await wheelStore.spin(times);
      const results = data.results ?? wheelStore.lastSpinResults;
      const lastResult = results[results.length - 1];
      await playSpinAnimation(lastResult?.prizeId);
      uiStore.openSpinResultModal();
    } catch (error) {
      uiStore.showToast(getErrorMessage(error), 'error');
    }
  }

  function handleSpinX1() {
    return handleSpin(1);
  }

  function handleSpinX10() {
    return handleSpin(10);
  }

  async function handleTicketHistoryClick() {
    if (!(await ensureCanParticipate())) return;

    uiStore.showLoading();
    try {
      await wheelStore.loadTicketHistory();
      uiStore.openTicketHistoryModal();
    } catch (error) {
      uiStore.showToast(getErrorMessage(error), 'error');
    } finally {
      uiStore.hideLoading();
    }
  }

  async function handleWinHistoryClick() {
    if (!(await ensureCanParticipate())) return;

    uiStore.showLoading();
    try {
      await wheelStore.loadWinHistory();
      uiStore.openWinHistoryModal();
    } catch (error) {
      uiStore.showToast(getErrorMessage(error), 'error');
    } finally {
      uiStore.hideLoading();
    }
  }

  if (import.meta.env.DEV) {
    /** @param {Event} event */
    function onMockUpdated(event) {
      const detail = /** @type {CustomEvent} */ (event).detail;
      refreshWheelInfo();
      if (detail?.granted && detail?.amount) {
        uiStore.showToast(t('toast.loginTickets', { amount: detail.amount }), 'success');
      }
    }

    onMounted(() => {
      window.addEventListener('civ-dev-mock-updated', onMockUpdated);
    });
    onUnmounted(() => {
      window.removeEventListener('civ-dev-mock-updated', onMockUpdated);
    });
  }

  return {
    tickets,
    wheelRotation,
    isWheelSpinning,
    rotatorRef,
    refreshWheelInfo,
    handleSpinX1,
    handleSpinX10,
    handleTicketHistoryClick,
    handleWinHistoryClick,
  };
}
