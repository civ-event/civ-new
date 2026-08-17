/** 外链地址（需求文档） */
export const ExternalLinks = {
  DOWNLOAD: 'https://popepoch.nex-wave-tech.com/',
  FACEBOOK: 'https://www.facebook.com/PopEpoch/',
  DISCORD: 'https://discord.com/invite/zdDda5sc4Y',
  PRIVACY: 'https://popepoch.nex-wave-tech.com/privacy-policy',
  TERMS: 'https://popepoch.nex-wave-tech.com/terms-of-service',
  TOPUP_BASE: 'https://popepoch.nex-wave-tech.com/topup/web/index.html',
};

/**
 * @param {{ roleId?: string, lang?: string }} [options]
 */
export function buildTopupUrl(options = {}) {
  const params = new URLSearchParams({
    gid: 'mpopen',
    is_wap: '1',
    role_id: options.roleId ?? '',
    lang: options.lang ?? 'en',
  });
  return `${ExternalLinks.TOPUP_BASE}?${params.toString()}`;
}

export function openExternalLink(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}
