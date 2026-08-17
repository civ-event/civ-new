import { computed, ref } from 'vue';
import slideImg294130 from '../assets/images/img-294130.png';
import slideImg310dd9 from '../assets/images/img-310dd9-trim-dd8f77.png';
import slideImg97c692 from '../assets/images/img-97c692-trim-a83023.png';
import slideRole from '../assets/images/role-5c9dd9.png';

const CHECKIN_CAROUSEL_SLIDES = [
  slideRole,
  slideImg294130,
  slideImg310dd9,
  slideImg97c692,
];

export function useCheckinCarousel() {
  const currentIndex = ref(0);
  const total = CHECKIN_CAROUSEL_SLIDES.length;

  const carouselImageStyle = computed(() => ({
    backgroundImage: `url("${CHECKIN_CAROUSEL_SLIDES[currentIndex.value]}")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
  }));

  function showPrev() {
    currentIndex.value = (currentIndex.value - 1 + total) % total;
  }

  function showNext() {
    currentIndex.value = (currentIndex.value + 1) % total;
  }

  return {
    carouselImageStyle,
    showPrev,
    showNext,
  };
}
