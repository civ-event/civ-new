import { onMounted, onUnmounted, ref } from 'vue';

const SECTIONS = [
  { id: 'checkin', selector: '.slogan-checkin' },
  { id: 'topup', selector: '.limited' },
  { id: 'wheel', selector: '.zhuanpanhuo' },
];

/**
 * @param {import('vue').Ref<number>} [scale]
 */
export function useSectionNav(scale) {
  const activeSection = ref('home');

  function scrollToSection(sectionId) {
    const section = SECTIONS.find((item) => item.id === sectionId);
    if (!section) return;

    const element = document.querySelector(section.selector);
    if (!element) return;

    const currentScale = scale?.value || 1;
    const top = element.getBoundingClientRect().top + window.scrollY;
    const offset = 12 * currentScale;
    window.scrollTo({ top: Math.max(0, top - offset), behavior: 'smooth' });
    activeSection.value = sectionId;
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    activeSection.value = 'home';
  }

  function updateActiveSection() {
    const probeY = window.scrollY + 100;
    const first = document.querySelector(SECTIONS[0].selector);
    if (first) {
      const firstTop = first.getBoundingClientRect().top + window.scrollY;
      if (probeY < firstTop - 24) {
        activeSection.value = 'home';
        return;
      }
    }

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
