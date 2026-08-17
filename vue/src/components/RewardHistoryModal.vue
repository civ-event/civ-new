<template>
  <Transition name="reward-history-fade">
    <div
      v-if="visible"
      class="reward-history-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reward-history-title"
      @click.self="handleClose"
    >
      <div class="reward-history-modal__panel">
        <h2 id="reward-history-title" class="reward-history-modal__title">{{ t('modal.rewardTitle') }}</h2>

        <div v-if="records.length" class="reward-history-modal__table-wrap">
          <table class="reward-history-modal__table">
            <thead>
              <tr>
                <th>{{ t('modal.timeUtc5') }}</th>
                <th>{{ t('modal.type') }}</th>
                <th>{{ t('modal.reward') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(record, index) in records" :key="`${record.claimedAt}-${index}`">
                <td>{{ formatClaimedAt(record.claimedAt) }}</td>
                <td>{{ formatType(record) }}</td>
                <td>{{ record.rewardName }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="reward-history-modal__empty">{{ t('modal.rewardEmpty') }}</p>

        <div class="reward-history-modal__actions">
          <button type="button" class="reward-history-modal__btn" @click="handleClose">
            {{ t('modal.close') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCheckinStore } from '../stores/checkin';
import { useUiStore } from '../stores/ui';
import { sortCheckinHistoryRecords } from '../utils/checkinHistory';
import { formatHistoryTime } from '../utils/datetime';

const { t, locale } = useI18n();
const uiStore = useUiStore();
const checkinStore = useCheckinStore();
const { rewardHistoryModalVisible: visible } = storeToRefs(uiStore);
const { history } = storeToRefs(checkinStore);
const records = computed(() => sortCheckinHistoryRecords(history.value));

function handleClose() {
  uiStore.closeRewardHistoryModal();
}

function formatClaimedAt(value) {
  return formatHistoryTime(value, locale.value);
}

function formatType(record) {
  if (record.type === 'milestone') {
    return t('modal.milestone', { days: record.days ?? '—' });
  }
  return t('modal.dailyCheckin');
}
</script>

<style scoped>
.reward-history-modal {
  position: fixed;
  inset: 0;
  z-index: 10002;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.45);
}

.reward-history-modal__panel {
  width: min(640px, 100%);
  max-height: min(80vh, 560px);
  overflow: auto;
  padding: 28px 32px 24px;
  border-radius: 12px;
  background: #fff8ef;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
}

.reward-history-modal__title {
  margin: 0 0 20px;
  color: #7b5410;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
}

.reward-history-modal__table-wrap {
  overflow-x: auto;
}

.reward-history-modal__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.reward-history-modal__table th,
.reward-history-modal__table td {
  padding: 10px 12px;
  border-bottom: 1px solid rgba(123, 84, 16, 0.15);
  text-align: left;
}

.reward-history-modal__table th {
  color: #965744;
  font-weight: 700;
  white-space: nowrap;
}

.reward-history-modal__table td {
  color: #4a3a2a;
}

.reward-history-modal__empty {
  margin: 0;
  padding: 24px 0;
  color: #7b5410;
  text-align: center;
}

.reward-history-modal__actions {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.reward-history-modal__btn {
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

.reward-history-modal__btn:hover {
  filter: brightness(1.05);
}

.reward-history-fade-enter-active,
.reward-history-fade-leave-active {
  transition: opacity 0.2s ease;
}

.reward-history-fade-enter-from,
.reward-history-fade-leave-to {
  opacity: 0;
}
</style>
