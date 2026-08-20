import { useI18n } from 'vue-i18n';
import { useCheckinStore } from '../stores/checkin';
import { useTopupStore } from '../stores/topup';
import { useUiStore } from '../stores/ui';
import { useUserStore } from '../stores/user';
import { useWheelStore } from '../stores/wheel';
import { ExternalLinks } from '../utils/links';
import { getErrorMessage } from '../utils/error';
import { resolveLoginToken } from '../bridge/auth.js';
import { openUrl } from '../bridge/navigation.js';
import { shareToPlatform } from '../bridge/share.js';

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
      const accessToken = await resolveLoginToken();
      await userStore.login({ accessToken });
      uiStore.showToast(t('toast.loginSuccess'), 'success');
      await openCharacterSelectModal();
    } catch (error) {
      uiStore.showToast(getErrorMessage(error), 'error');
    } finally {
      uiStore.hideLoading();
    }
  }

  function handleDownloadClick() {
    openUrl(ExternalLinks.DOWNLOAD);
  }

  async function handleFacebookClick() {
    try {
      await shareToPlatform({
        platform: 'facebook',
        text: 'Join the Pop Epoch event!',
        url: ExternalLinks.FACEBOOK,
        image: '',
      });
    } catch (error) {
      uiStore.showToast(getErrorMessage(error), 'error');
    }
  }

  function handleDiscordClick() {
    openUrl(ExternalLinks.DISCORD);
  }

  return {
    handleLoginClick,
    handleDownloadClick,
    handleFacebookClick,
    handleDiscordClick,
    openCharacterSelectModal,
  };
}
