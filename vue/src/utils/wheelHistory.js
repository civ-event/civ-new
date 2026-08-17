/**
 * @param {Array<{ obtainedAt?: string, wonAt?: string }>} records
 * @param {'obtainedAt' | 'wonAt'} field
 */
export function sortWheelHistoryRecords(records = [], field = 'obtainedAt') {
  return [...records].sort((a, b) => {
    const timeB = Date.parse(b[field] ?? '');
    const timeA = Date.parse(a[field] ?? '');
    const safeB = Number.isNaN(timeB) ? 0 : timeB;
    const safeA = Number.isNaN(timeA) ? 0 : timeA;
    return safeB - safeA;
  });
}

export function formatTicketSource(source, t) {
  if (source === 'game_login') return t('wheel.sourceGameLogin');
  if (source === 'checkin') return t('wheel.sourceCheckin');
  return source ?? '—';
}
