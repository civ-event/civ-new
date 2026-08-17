const UTC5_OFFSET_MS = 5 * 3600000;

/**
 * @param {Date} date
 * @returns {Date}
 */
export function toUtc5Date(date = new Date()) {
  const utcMs = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utcMs - UTC5_OFFSET_MS);
}

/**
 * @param {number} value
 * @returns {string}
 */
function pad2(value) {
  return String(value).padStart(2, '0');
}

/**
 * @param {Date} date
 * @returns {string}
 */
export function formatUtc5DateTime(date = new Date()) {
  const utc5 = toUtc5Date(date);
  return `${utc5.getFullYear()}/${utc5.getMonth() + 1}/${utc5.getDate()} ${pad2(utc5.getHours())}:${pad2(utc5.getMinutes())}:${pad2(utc5.getSeconds())}`;
}

/**
 * @param {string | null | undefined} iso
 * @returns {string}
 */
export function formatUtc5FromIso(iso) {
  if (!iso) return '';
  const parsed = Date.parse(iso);
  if (Number.isNaN(parsed)) return '';
  return formatUtc5DateTime(new Date(parsed));
}

/**
 * @param {string | null | undefined} iso
 * @returns {{ date: string, time: string }}
 */
export function splitUtc5Iso(iso) {
  if (!iso) return { date: '', time: '' };
  const parsed = Date.parse(iso);
  if (Number.isNaN(parsed)) return { date: '', time: '' };
  const utc5 = toUtc5Date(new Date(parsed));
  return {
    date: `${utc5.getFullYear()}/${utc5.getMonth() + 1}/${utc5.getDate()}`,
    time: `${pad2(utc5.getHours())}:${pad2(utc5.getMinutes())}`,
  };
}

/**
 * @param {string | null | undefined} startAt
 * @param {string | null | undefined} endAt
 * @param {string} [fallback]
 * @returns {string}
 */
export function formatEventDurationRange(startAt, endAt, fallback = '') {
  if (!startAt || !endAt) return fallback;
  const start = splitUtc5Iso(startAt);
  const end = splitUtc5Iso(endAt);
  if (!start.date || !end.date) return fallback;
  return `${start.date} - ${end.date} ${end.time}`;
}

const HISTORY_LOCALES = {
  en: 'en-US',
  de: 'de-DE',
  fr: 'fr-FR',
  es: 'es-ES',
  pt: 'pt-BR',
};

/**
 * @param {string | null | undefined} value
 * @param {string} [locale]
 * @returns {string}
 */
export function formatHistoryTime(value, locale = 'en') {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(HISTORY_LOCALES[locale] ?? 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/New_York',
  });
}
