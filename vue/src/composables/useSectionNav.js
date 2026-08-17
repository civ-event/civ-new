import { onMounted, onUnmounted, ref } from 'vue';

const SECTIONS = [
  { id: 'topup', selector: '.limited', tabClass: 'reward-5' },
  { id: 'checkin', selector: '.slogan-checkin', tabClass: 'btn-checkin-5-stack' },
  { id: 'wheel', selector: '.zhuanpanhuo', tabClass: 'lucky-wheel' },
];

/**
 * @param {number} scale
 */
export function useSectionNav(scale) {
  const activeSection = ref('topup');

  function scrollToSection(sectionId) {
    const section = SECTIONS.find((item) => item.id === sectionId);
    if (!section) return;

    const element = document.querySelector(section.selector);
    if (!element) return;

    const currentScale = scale.value || 1;
    const top = element.getBoundingClientRect().top + window.scrollY;
    const offset = 24 * currentScale;
    window.scrollTo({ top: Math.max(0, top - offset), behavior: 'smooth' });
    activeSection.value = sectionId;
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    activeSection.value = 'topup';
  }

  function updateActiveSection() {
    const probeY = window.scrollY + 120;
    let matched = SECTIONS[0].id;

    for (const section of SECTIONS) {
      const element = document.querySelector(section.selector);
      if (!element) continue;
      const top = element.getBoundingClientRect().top + window.scrollY;
      if (probeY >= top) matched = section.id;
    }

    activeSection.value = matched;
  }

  onMounted(() => {
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    updateActiveSection();
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', updateActiveSection);
  });

  function getTabClass(sectionId) {
    return {
      'is-nav-active': activeSection.value === sectionId,
    };
  }

  return {
    activeSection,
    scrollToSection,
    scrollToTop,
    getTabClass,
  };
}
