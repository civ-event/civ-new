<template>
  <Transition name="history-modal-fade">
    <div
      v-if="visible"
      class="history-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="win-history-title"
      @click.self="handleClose"
    >
      <div class="history-modal__panel">
        <h2 id="win-history-title" class="history-modal__title">{{ t('modal.winTitle') }}</h2>

        <div v-if="records.length" class="history-modal__table-wrap">
          <table class="history-modal__table">
            <thead>
              <tr>
                <th>{{ t('modal.timeUtc5') }}</th>
                <th>{{ t('modal.prize') }}</th>
                <th>{{ t('modal.qty') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(record, index) in records" :key="`${record.wonAt}-${index}`">
                <td>{{ formatTime(record.wonAt) }}</td>
                <td>{{ record.prizeName }}</td>
                <td>{{ record.quantity }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="history-modal__empty">{{ t('modal.winEmpty') }}</p>

        <div class="history-modal__actions">
          <button type="button" class="history-modal__btn" @click="handleClose">{{ t('modal.close') }}</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useUiStore } from '../stores/ui';
import { useWheelStore } from '../stores/wheel';
import { formatHistoryTime } from '../utils/datetime';

const { t, locale } = useI18n();
const uiStore = useUiStore();
const wheelStore = useWheelStore();
const { winHistoryModalVisible: visible } = storeToRefs(uiStore);
const { winHistory: records } = storeToRefs(wheelStore);

function handleClose() {
  uiStore.closeWinHistoryModal();
}

function formatTime(value) {
  return formatHistoryTime(value, locale.value);
}
</script>

<style scoped>
.history-modal {
  position: fixed;
  inset: 0;
  z-index: 10002;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.45);
}

.history-modal__panel {
  width: min(640px, 100%);
  max-height: min(80vh, 560px);
  overflow: auto;
  padding: 28px 32px 24px;
  border-radius: 12px;
  background: #fff8ef;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
}

.history-modal__title {
  margin: 0 0 20px;
  color: #7b5410;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
}

.history-modal__table-wrap {
  overflow-x: auto;
}

.history-modal__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.history-modal__table th,
.history-modal__table td {
  padding: 10px 12px;
  border-bottom: 1px solid rgba(123, 84, 16, 0.15);
  text-align: left;
}

.history-modal__table th {
  color: #965744;
  font-weight: 700;
  white-space: nowrap;
}

.history-modal__table td {
  color: #4a3a2a;
}

.history-modal__empty {
  margin: 0;
  padding: 24px 0;
  color: #7b5410;
  text-align: center;
}

.history-modal__actions {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.history-modal__btn {
  min-width: 120px;
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  background: linear-gradient(180deg, #d9a56e 0%, #b87d45 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

.history-modal-fade-enter-active,
.history-modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.history-modal-fade-enter-from,
.history-modal-fade-leave-to {
  opacity: 0;
}
</style>
