import { createI18n } from 'vue-i18n';
import { messages, readPersistedLocale } from './messages';

export { LANGUAGE_OPTIONS, persistLocale } from './messages';

export const i18n = createI18n({
  legacy: false,
  locale: readPersistedLocale(),
  fallbackLocale: 'en',
  messages,
});

export default i18n;
