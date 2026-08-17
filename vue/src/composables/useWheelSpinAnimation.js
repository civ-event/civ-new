import { ref } from 'vue';
import { computeSpinTargetRotation } from '../utils/wheelSpinAngles';

export const WHEEL_SPIN_DURATION_MS = 3200;

export function useWheelSpinAnimation() {
  const wheelRotation = ref(0);
  const isWheelSpinning = ref(false);
  /** @type {import('vue').Ref<HTMLElement | null>} */
  const rotatorRef = ref(null);

  /**
   * @param {string | undefined} prizeId
   * @returns {Promise<void>}
   */
  function playSpinAnimation(prizeId) {
    if (isWheelSpinning.value) {
      return Promise.resolve();
    }

    isWheelSpinning.value = true;
    const targetRotation = computeSpinTargetRotation(wheelRotation.value, prizeId);
    wheelRotation.value = targetRotation;

    return new Promise((resolve) => {
      const el = rotatorRef.value;
      if (!el) {
        window.setTimeout(() => {
          isWheelSpinning.value = false;
          resolve();
        }, WHEEL_SPIN_DURATION_MS);
        return;
      }

      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        el.removeEventListener('transitionend', onTransitionEnd);
        isWheelSpinning.value = false;
        resolve();
      };

      const onTransitionEnd = (event) => {
        if (event.target !== el || event.propertyName !== 'transform') return;
        finish();
      };

      el.addEventListener('transitionend', onTransitionEnd);
      window.setTimeout(finish, WHEEL_SPIN_DURATION_MS + 120);
    });
  }

  return {
    wheelRotation,
    isWheelSpinning,
    rotatorRef,
    playSpinAnimation,
  };
}
