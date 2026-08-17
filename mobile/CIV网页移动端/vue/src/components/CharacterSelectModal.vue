<template>
  <Transition name="character-modal-fade">
    <div
      v-if="visible"
      class="character-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="character-modal-title"
      @click.self="handleCancel"
    >
      <div class="character-modal__panel">
        <h2 id="character-modal-title" class="character-modal__title">{{ t('modal.characterTitle') }}</h2>

        <label class="character-modal__label" for="character-server">{{ t('modal.server') }}</label>
        <select
          id="character-server"
          v-model="selectedServerId"
          class="character-modal__select"
        >
          <option value="">{{ t('modal.pleaseSelect') }}</option>
          <option v-for="server in servers" :key="server.serverId" :value="server.serverId">
            {{ server.serverName }}
          </option>
        </select>

        <label class="character-modal__label">{{ t('modal.nickname') }}</label>
        <div class="character-modal__nickname">
          {{ selectedRole?.roleName || '—' }}
        </div>

        <p v-if="selectedRole && selectedRole.level < 5" class="character-modal__warning">
          {{ t('errors.levelTooLow') }}
        </p>

        <div class="character-modal__actions">
          <button type="button" class="character-modal__btn character-modal__btn--ghost" @click="handleCancel">
            {{ t('modal.cancel') }}
          </button>
          <button
            type="button"
            class="character-modal__btn character-modal__btn--primary"
            :disabled="!selectedRole || submitting"
            @click="handleConfirm"
          >
            {{ t('modal.confirm') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useUiStore } from '../stores/ui';
import { useUserStore } from '../stores/user';
import { getErrorMessage } from '../utils/error';

const { t } = useI18n();
const uiStore = useUiStore();
const userStore = useUserStore();
const { characterModalVisible: visible } = storeToRefs(uiStore);
const { roles } = storeToRefs(userStore);

const selectedServerId = ref('');
const submitting = ref(false);

const servers = computed(() => {
  const map = new Map();
  for (const role of roles.value) {
    if (!map.has(role.serverId)) {
      map.set(role.serverId, {
        serverId: role.serverId,
        serverName: role.serverName,
      });
    }
  }
  return Array.from(map.values());
});

const selectedRole = computed(() =>
  roles.value.find((role) => role.serverId === selectedServerId.value) ?? null,
);

watch(visible, (open) => {
  if (!open) {
    selectedServerId.value = '';
    submitting.value = false;
    return;
  }

  if (userStore.role?.serverId) {
    selectedServerId.value = userStore.role.serverId;
  } else if (servers.value.length === 1) {
    selectedServerId.value = servers.value[0].serverId;
  } else {
    selectedServerId.value = '';
  }
});

function handleCancel() {
  uiStore.closeCharacterModal();
}

async function handleConfirm() {
  if (!selectedRole.value || submitting.value) return;

  submitting.value = true;
  uiStore.showLoading();
  try {
    const role = await userStore.selectRole(selectedRole.value.roleId);
    uiStore.closeCharacterModal();
    uiStore.showToast(t('toast.characterSelected', { name: role.roleName }), 'success');
    if (role.level < 5) {
      uiStore.showToast(t('errors.levelTooLow'), 'error');
    }
  } catch (error) {
    uiStore.showToast(getErrorMessage(error), 'error');
  } finally {
    submitting.value = false;
    uiStore.hideLoading();
  }
}
</script>

<style scoped>
.character-modal {
  position: fixed;
  inset: 0;
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.45);
}

.character-modal__panel {
  width: min(480px, 100%);
  padding: 28px 32px;
  border: 2px solid #5c3d1e;
  border-radius: 16px;
  background: linear-gradient(180deg, #fff6df 0%, #f3dfab 100%);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
}

.character-modal__title {
  margin-bottom: 20px;
  color: #5c3d1e;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 28px;
  font-weight: 700;
  text-align: center;
}

.character-modal__label {
  display: block;
  margin-bottom: 8px;
  color: #906036;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 18px;
  font-weight: 700;
}

.character-modal__select {
  width: 100%;
  height: 44px;
  margin-bottom: 18px;
  padding: 0 12px;
  border: 2px solid #5c3d1e;
  border-radius: 8px;
  background: #fff;
  color: #5c3d1e;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
}

.character-modal__nickname {
  min-height: 44px;
  margin-bottom: 12px;
  padding: 10px 12px;
  border: 2px solid rgba(92, 61, 30, 0.25);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.72);
  color: #5c3d1e;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 18px;
  font-weight: 700;
}

.character-modal__warning {
  margin-bottom: 16px;
  color: #b71c1c;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  line-height: 1.4;
}

.character-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.character-modal__btn {
  min-width: 108px;
  height: 42px;
  padding: 0 18px;
  border-radius: 8px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

.character-modal__btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.character-modal__btn--ghost {
  border: 2px solid #5c3d1e;
  background: transparent;
  color: #5c3d1e;
}

.character-modal__btn--primary {
  border: 2px solid #5c3d1e;
  background: linear-gradient(180deg, #fff0b0 0%, #efb840 100%);
  color: #5c3d1e;
}

.character-modal-fade-enter-active,
.character-modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.character-modal-fade-enter-from,
.character-modal-fade-leave-to {
  opacity: 0;
}
</style>
