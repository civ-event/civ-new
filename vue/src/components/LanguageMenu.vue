<template>
  <div class="language-menu" @click.stop>
    <button
      v-for="option in options"
      :key="option.code"
      type="button"
      class="language-menu__item"
      :class="{ 'is-active': option.code === currentLocale }"
      @click="$emit('select', option.code)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  options: {
    type: Array,
    required: true,
  },
  currentLocale: {
    type: String,
    required: true,
  },
});

defineEmits(['select', 'close']);
</script>

<style scoped>
.language-menu {
  position: fixed;
  top: 92px;
  right: 24px;
  z-index: 10006;
  min-width: 148px;
  padding: 8px 0;
  border-radius: 8px;
  background: rgba(255, 252, 240, 0.98);
  border: 1px solid rgba(178, 133, 44, 0.45);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}

.language-menu__item {
  display: block;
  width: 100%;
  padding: 10px 16px;
  border: 0;
  background: transparent;
  color: rgba(90, 56, 22, 1);
  font-size: 14px;
  text-align: left;
  cursor: pointer;
}

.language-menu__item:hover,
.language-menu__item.is-active {
  background: rgba(255, 210, 80, 0.35);
}
</style>
