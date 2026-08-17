import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import i18n from './i18n';
import {
  mockCheckinMilestone10,
  mockCheckinMilestone7,
  mockGrantLoginTickets,
  mockTopupAllClaimable,
  mockTopupReady999,
  mockWheelSpinReady,
  resetMockState,
  setMockScenario,
} from './api/dev';

const app = createApp(App);

app.use(createPinia());
app.use(i18n);
app.mount('#app');

if (import.meta.env.DEV) {
  window.__CIV_DEV__ = {
    resetMockState,
    setMockScenario,
    mockCheckinMilestone7,
    mockCheckinMilestone10,
    mockWheelSpinReady,
    mockGrantLoginTickets,
    mockTopupReady999,
    mockTopupAllClaimable,
  };
}
