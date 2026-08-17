import { useI18n } from 'vue-i18n';
import { useActivityStore } from '../stores/activity';
import { useUiStore } from '../stores/ui';
import { useUserStore } from '../stores/user';
import { useGlobalActions } from './useGlobalActions';

export function useParticipateGuard() {
  const { t } = useI18n();
  const uiStore = useUiStore();
  const userStore = useUserStore();
  const activityStore = useActivityStore();
  const { openCharacterSelectModal } = useGlobalActions();

  async function ensureCanParticipate() {
    if (activityStore.status === 'not_started') {
      uiStore.showToast(t('errors.eventNotStarted'), 'error');
      return false;
    }
    if (activityStore.status === 'ended') {
      uiStore.showToast(t('errors.eventEnded'), 'error');
      return false;
    }
    if (!userStore.isLoggedIn) {
      uiStore.showToast(t('errors.pleaseLogin'), 'error');
      return false;
    }
    if (!userStore.hasRole) {
      await openCharacterSelectModal();
      return false;
    }
    if (!userStore.canParticipate) {
      uiStore.showToast(t('errors.levelTooLow'), 'error');
      return false;
    }
    return true;
  }

  return { ensureCanParticipate, t };
}
