<template>
  <Transition name="app-loading-fade">
    <div v-if="loading" class="app-loading" aria-live="polite" aria-busy="true">
      <div class="app-loading__spinner"></div>
    </div>
  </Transition>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useUiStore } from '../stores/ui';

const uiStore = useUiStore();
const { loading } = storeToRefs(uiStore);
</script>

<style scoped>
.app-loading {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.25);
}

.app-loading__spinner {
  width: 44px;
  height: 44px;
  border: 4px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: app-loading-spin 0.8s linear infinite;
}

@keyframes app-loading-spin {
  to {
    transform: rotate(360deg);
  }
}

.app-loading-fade-enter-active,
.app-loading-fade-leave-active {
  transition: opacity 0.2s ease;
}

.app-loading-fade-enter-from,
.app-loading-fade-leave-to {
  opacity: 0;
}
</style>
