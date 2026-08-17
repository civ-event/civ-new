<template>
  <Transition name="app-toast-fade">
    <div v-if="toast" class="app-toast" :class="`app-toast--${toast.type}`" role="status">
      {{ toast.message }}
    </div>
  </Transition>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useUiStore } from '../stores/ui';

const uiStore = useUiStore();
const { toast } = storeToRefs(uiStore);
</script>

<style scoped>
.app-toast {
  position: fixed;
  left: 50%;
  top: 24px;
  z-index: 10005;
  max-width: min(520px, calc(100vw - 32px));
  padding: 12px 20px;
  border-radius: 8px;
  color: #fff;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  line-height: 1.4;
  text-align: center;
  transform: translateX(-50%);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  pointer-events: none;
}

.app-toast--info {
  background: rgba(92, 61, 30, 0.92);
}

.app-toast--success {
  background: rgba(46, 125, 50, 0.92);
}

.app-toast--error {
  background: rgba(183, 28, 28, 0.92);
}

.app-toast-fade-enter-active,
.app-toast-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.app-toast-fade-enter-from,
.app-toast-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px);
}
</style>
