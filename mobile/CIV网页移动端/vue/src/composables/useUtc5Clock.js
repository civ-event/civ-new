import { computed, onMounted, onUnmounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useActivityStore } from '../stores/activity';
import { formatUtc5DateTime } from '../utils/datetime';

export function useUtc5Clock() {
  const activityStore = useActivityStore();
  const { serverTime } = storeToRefs(activityStore);
  const now = ref(new Date());
  let timerId = null;
  let serverOffsetMs = 0;

  function syncServerOffset() {
    if (!serverTime.value) {
      serverOffsetMs = 0;
      return;
    }
    const parsed = Date.parse(serverTime.value);
    if (Number.isNaN(parsed)) {
      serverOffsetMs = 0;
      return;
    }
    serverOffsetMs = parsed - Date.now();
  }

  const currentUtc5Text = computed(() => {
    const adjusted = new Date(now.value.getTime() + serverOffsetMs);
    return formatUtc5DateTime(adjusted);
  });

  onMounted(() => {
    syncServerOffset();
    timerId = window.setInterval(() => {
      now.value = new Date();
    }, 1000);
  });

  onUnmounted(() => {
    if (timerId) window.clearInterval(timerId);
  });

  return {
    currentUtc5Text,
    syncServerOffset,
  };
}
