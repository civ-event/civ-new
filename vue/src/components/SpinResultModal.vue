<template>
  <Transition name="history-modal-fade">
    <div
      v-if="visible"
      class="history-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="spin-result-title"
      @click.self="handleClose"
    >
      <div class="history-modal__panel">
        <h2 id="spin-result-title" class="history-modal__title">{{ t('modal.spinTitle') }}</h2>
        <p class="spin-result__subtitle">{{ t('modal.spinSubtitle') }}</p>

        <ul v-if="results.length" class="spin-result__list">
          <li v-for="(prize, index) in results" :key="`${prize.prizeId}-${index}`">
            {{ prize.name }}
          </li>
        </ul>
        <p v-else class="history-modal__empty">{{ t('modal.spinEmpty') }}</p>

        <p class="spin-result__tickets">{{ t('modal.ticketsLeft', { tickets }) }}</p>

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

const { t } = useI18n();
const uiStore = useUiStore();
const wheelStore = useWheelStore();
const { spinResultModalVisible: visible } = storeToRefs(uiStore);
const { lastSpinResults: results, tickets } = storeToRefs(wheelStore);

function handleClose() {
  uiStore.closeSpinResultModal();
}
</script>

<style scoped>
.history-modal {
  position: fixed;
  inset: 0;
  z-index: 10003;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.45);
}

.history-modal__panel {
  width: min(520px, 100%);
  max-height: min(80vh, 560px);
  overflow: auto;
  padding: 28px 32px 24px;
  border-radius: 12px;
  background: #fff8ef;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
}

.history-modal__title {
  margin: 0 0 8px;
  color: #7b5410;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
}

.spin-result__subtitle {
  margin: 0 0 20px;
  color: #965744;
  font-size: 14px;
  text-align: center;
}

.spin-result__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.spin-result__list li {
  padding: 10px 12px;
  border-bottom: 1px solid rgba(123, 84, 16, 0.15);
  color: #4a3a2a;
  font-size: 15px;
  text-align: center;
}

.spin-result__tickets {
  margin: 16px 0 0;
  color: #7b5410;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
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
