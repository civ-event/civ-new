import { createI18n } from 'vue-i18n';
import { messages, readPersistedLocale } from './messages';

export { LANGUAGE_OPTIONS, persistLocale } from './messages';

export const i18n = createI18n({
  legacy: false,
  locale: readPersistedLocale(),
  fallbackLocale: 'en',
  messages,
  // 规则文案含 <br />，配合 v-html 渲染；来源为静态 ruleTexts，非用户输入
  warnHtmlMessage: false,
});

export default i18n;
