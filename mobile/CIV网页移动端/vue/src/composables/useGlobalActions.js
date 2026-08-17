import { useI18n } from 'vue-i18n';
import { useCheckinStore } from '../stores/checkin';
import { useTopupStore } from '../stores/topup';
import { useUiStore } from '../stores/ui';
import { useUserStore } from '../stores/user';
import { useWheelStore } from '../stores/wheel';
import { ExternalLinks, openExternalLink } from '../utils/links';
import { getErrorMessage } from '../utils/error';

export function useGlobalActions() {
  const { t } = useI18n();
  const uiStore = useUiStore();
  const userStore = useUserStore();
  const checkinStore = useCheckinStore();
  const wheelStore = useWheelStore();
  const topupStore = useTopupStore();

  async function openCharacterSelectModal() {
    uiStore.showLoading();
    try {
      await userStore.loadRoles();
      if (!userStore.roles.length) {
        uiStore.showToast(t('toast.noCharacters'), 'error');
        return;
      }
      uiStore.openCharacterModal();
    } catch (error) {
      uiStore.showToast(getErrorMessage(error), 'error');
    } finally {
      uiStore.hideLoading();
    }
  }

  async function handleLogout() {
    uiStore.showLoading();
    try {
      await userStore.logout();
      checkinStore.reset();
      wheelStore.reset();
      topupStore.reset();
      uiStore.closeCharacterModal();
      uiStore.closeRewardHistoryModal();
      uiStore.closeTicketHistoryModal();
      uiStore.closeWinHistoryModal();
      uiStore.closeSpinResultModal();
      uiStore.showToast(t('toast.logoutSuccess'), 'success');
    } catch (error) {
      uiStore.showToast(getErrorMessage(error), 'error');
    } finally {
      uiStore.hideLoading();
    }
  }

  async function handleLoginClick() {
    if (userStore.isLoggedIn) {
      await handleLogout();
      return;
    }

    uiStore.showLoading();
    try {
      await userStore.login();
      uiStore.showToast(t('toast.loginSuccess'), 'success');
      await openCharacterSelectModal();
    } catch (error) {
      uiStore.showToast(getErrorMessage(error), 'error');
    } finally {
      uiStore.hideLoading();
    }
  }

  function handleDownloadClick() {
    openExternalLink(ExternalLinks.DOWNLOAD);
  }

  function handleFacebookClick() {
    openExternalLink(ExternalLinks.FACEBOOK);
  }

  function handleDiscordClick() {
    openExternalLink(ExternalLinks.DISCORD);
  }

  return {
    handleLoginClick,
    handleDownloadClick,
    handleFacebookClick,
    handleDiscordClick,
    openCharacterSelectModal,
  };
}
