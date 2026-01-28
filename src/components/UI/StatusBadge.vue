<template>
  <span
    class="px-2 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 w-fit"
    :class="colorClasses"
  >
    <span v-if="showDot" class="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>

    <slot>{{ status }}</slot>
  </span>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'StatusBadge',
  props: {
    status: { type: String, required: true },
    showDot: { type: Boolean, default: false }
  },
  setup(props) {
    const colorClasses = computed(() => {
      const s = props.status?.toLowerCase() || '';

      const styles: Record<string, string> = {
        paid: "bg-emerald-50 text-emerald-700 border-emerald-100",
        delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
        shipped: "bg-blue-50 text-blue-700 border-blue-100",
        pending: "bg-amber-50 text-amber-700 border-amber-100",
        processing: "bg-indigo-50 text-indigo-700 border-indigo-100",
        cancelled: "bg-rose-50 text-rose-700 border-rose-100",
        refunded: "bg-purple-50 text-purple-700 border-purple-100",

        // Generic defaults
        success: "bg-emerald-50 text-emerald-700 border-emerald-100",
        warning: "bg-amber-50 text-amber-700 border-amber-100",
        danger: "bg-rose-50 text-rose-700 border-rose-100",
        info: "bg-blue-50 text-blue-700 border-blue-100",
      };

      return styles[s] || "bg-slate-50 text-slate-700 border-slate-100";
    });

    return { colorClasses };
  }
});
</script>
