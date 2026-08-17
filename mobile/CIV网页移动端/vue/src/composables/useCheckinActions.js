import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useCheckinStore } from '../stores/checkin';
import { useUiStore } from '../stores/ui';
import { useUserStore } from '../stores/user';
import { useWheelStore } from '../stores/wheel';
import { getErrorMessage } from '../utils/error';
import { useParticipateGuard } from './useParticipateGuard';

const PROGRESS_FILL_AT_7 = 411;
const PROGRESS_FILL_AT_10 = 635;

function calcProgressFillWidth(checkedDays) {
  const days = Math.max(0, Math.min(10, Number(checkedDays) || 0));
  if (days <= 0) return 0;
  if (days <= 7) {
    return (days / 7) * PROGRESS_FILL_AT_7;
  }
  return PROGRESS_FILL_AT_7 + ((days - 7) / 3) * (PROGRESS_FILL_AT_10 - PROGRESS_FILL_AT_7);
}

export function useCheckinActions() {
  const uiStore = useUiStore();
  const userStore = useUserStore();
  const checkinStore = useCheckinStore();
  const wheelStore = useWheelStore();
  const { ensureCanParticipate, t } = useParticipateGuard();

  const {
    checkedDays,
    todayChecked,
    milestone7,
    milestone10,
    dayStatusMap,
  } = storeToRefs(checkinStore);

  const progressBarStyle = computed(() => ({
    width: `${calcProgressFillWidth(checkedDays.value)}px`,
  }));

  const dailyCheckinButtonClass = computed(() => ({
    'is-checkin-disabled': todayChecked.value,
  }));

  const milestone7Class = computed(() => getMilestoneClass(milestone7.value?.status));
  const milestone10Class = computed(() => getMilestoneClass(milestone10.value?.status));

  function getMilestoneClass(status) {
    return {
      'is-milestone-claimable': status === 'claimable',
      'is-milestone-claimed': status === 'claimed',
      'is-milestone-locked': status === 'locked',
    };
  }

  function getDayClass(day) {
    const status = dayStatusMap.value[day] ?? 'locked';
    return {
      'is-checkin-claimed': status === 'claimed',
      'is-checkin-claimable': status === 'claimable',
      'is-checkin-locked': status === 'locked',
      'is-clickable': status === 'claimable',
    };
  }

  async function handleDayClick(day) {
    const status = dayStatusMap.value[day] ?? 'locked';
    if (status === 'claimable') {
      await handleDailyCheckin();
      return;
    }
    if (status === 'claimed') {
      if (todayChecked.value && day === checkedDays.value) {
        uiStore.showToast(t('errors.alreadyCheckedIn'));
      } else {
        uiStore.showToast(t('errors.rewardClaimed'));
      }
      return;
    }
    if (!(await ensureCanParticipate())) return;
    uiStore.showToast(t('errors.checkinDayLocked'), 'error');
  }

  async function refreshCheckinStatus() {
    if (!userStore.canParticipate) {
      checkinStore.reset();
      return;
    }

    try {
      await checkinStore.loadStatus();
    } catch (error) {
      console.error('[checkin] failed to load status', error);
      uiStore.showToast(getErrorMessage(error), 'error');
    }
  }

  async function handleDailyCheckin() {
    if (!(await ensureCanParticipate())) return;

    if (todayChecked.value) {
      uiStore.showToast(t('errors.alreadyCheckedIn'), 'info');
      return;
    }

    uiStore.showLoading();
    try {
      const result = await checkinStore.checkinDaily();
      wheelStore.setTickets(result.ticketsTotal);
      await wheelStore.loadInfo();
      uiStore.showToast(
        t('toast.checkinSuccess', { day: result.day, amount: result.ticketReward }),
        'success',
      );
    } catch (error) {
      uiStore.showToast(getErrorMessage(error), 'error');
    } finally {
      uiStore.hideLoading();
    }
  }

  async function handleMilestoneClaim(days) {
    if (!(await ensureCanParticipate())) return;

    const milestone = days === 7 ? milestone7.value : milestone10.value;
    if (!milestone) return;

    if (milestone.status === 'claimed') {
      uiStore.showToast(t('errors.rewardClaimed'));
      return;
    }
    if (milestone.status === 'locked') {
      uiStore.showToast(t('errors.milestoneNotReady'), 'error');
      return;
    }

    uiStore.showLoading();
    try {
      const result = await checkinStore.claimMilestone(days);
      uiStore.showToast(t('toast.claimed', { name: result.reward.name }), 'success');
    } catch (error) {
      uiStore.showToast(getErrorMessage(error), 'error');
    } finally {
      uiStore.hideLoading();
    }
  }

  async function handleRewardHistoryClick() {
    if (!(await ensureCanParticipate())) return;

    uiStore.showLoading();
    try {
      await checkinStore.loadHistory();
      uiStore.openRewardHistoryModal();
    } catch (error) {
      uiStore.showToast(getErrorMessage(error), 'error');
    } finally {
      uiStore.hideLoading();
    }
  }

  return {
    checkedDays,
    todayChecked,
    progressBarStyle,
    dailyCheckinButtonClass,
    milestone7Class,
    milestone10Class,
    getDayClass,
    refreshCheckinStatus,
    handleDailyCheckin,
    handleDayClick,
    handleMilestoneClaim,
    handleRewardHistoryClick,
  };
}
