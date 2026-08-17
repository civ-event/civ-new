import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTopupStore } from '../stores/topup';
import { useUiStore } from '../stores/ui';
import { useUserStore } from '../stores/user';
import { getErrorMessage } from '../utils/error';
import { i18n } from '../i18n';
import { buildTopupUrl, openExternalLink } from '../utils/links';
import { calcTopupProgressFillWidth } from '../utils/topupProgress';
import { useParticipateGuard } from './useParticipateGuard';

export function useTopupActions() {
  const uiStore = useUiStore();
  const userStore = useUserStore();
  const topupStore = useTopupStore();
  const { ensureCanParticipate, t } = useParticipateGuard();

  const { totalTopup, tierStatusMap } = storeToRefs(topupStore);

  const topupProgressBarStyle = computed(() => ({
    width: `${calcTopupProgressFillWidth(totalTopup.value)}px`,
  }));

  function getTierClass(amount) {
    const status = tierStatusMap.value[amount] ?? 'locked';
    return {
      'is-topup-claimable': status === 'claimable',
      'is-topup-claimed': status === 'claimed',
      'is-topup-locked': status === 'locked',
      'is-clickable': status === 'claimable',
    };
  }

  async function refreshTopupProgress() {
    if (!userStore.canParticipate) {
      topupStore.reset();
      return;
    }

    try {
      await topupStore.loadProgress();
    } catch (error) {
      console.error('[topup] failed to load progress', error);
      uiStore.showToast(getErrorMessage(error), 'error');
    }
  }

  async function handleTierClaim(amount) {
    if (!(await ensureCanParticipate())) return;

    const status = tierStatusMap.value[amount] ?? 'locked';

    if (status === 'claimed') {
      uiStore.showToast(t('errors.topupClaimed'));
      return;
    }
    if (status === 'locked') {
      uiStore.showToast(t('errors.topupNotReached'), 'error');
      return;
    }

    uiStore.showLoading();
    try {
      const result = await topupStore.claimTier(amount);
      uiStore.showToast(t('toast.claimed', { name: result.reward.name }), 'success');
    } catch (error) {
      uiStore.showToast(getErrorMessage(error), 'error');
    } finally {
      uiStore.hideLoading();
    }
  }

  function handleTopupCenterClick() {
    openExternalLink(buildTopupUrl({
      roleId: userStore.role?.roleId,
      lang: i18n.global.locale.value,
    }));
  }

  return {
    totalTopup,
    topupProgressBarStyle,
    getTierClass,
    refreshTopupProgress,
    handleTierClaim,
    handleTopupCenterClick,
  };
}
