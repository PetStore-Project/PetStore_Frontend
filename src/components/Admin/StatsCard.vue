<template>
  <div class="group relative p-6 bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
    <!-- Icon Background (Decorative) -->
    <div class="absolute top-0 right-0 p-4 opacity-25 group-hover:opacity-40 transition" :class="colorClass">
      <slot name="icon"></slot>
    </div>

    <!-- Content -->
    <div>
      <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ label }}</p>
      <h3 class="text-3xl font-black text-slate-900 mt-2">{{ value }}</h3>
      
      <!-- Optional Slot for Subtext/Trend (e.g. "+5% vs last month") -->
      <div v-if="$slots.subtext" class="mt-4 flex items-center gap-2">
        <slot name="subtext"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'StatsCard',
  props: {
    label: { type: String, required: true },
    value: { type: [String, Number], required: true },
    color: { 
      type: String, 
      default: 'emerald', // emerald, blue, purple, amber, etc.
      validator: (val: string) => ['emerald', 'blue', 'purple', 'amber', 'red', 'rose', 'indigo', 'cyan'].includes(val)
    }
  },
  setup(props) {
    const colorClass = computed(() => {
      // Allow dynamic color classes for text
      return `text-${props.color}-500`;
    });

    return { colorClass };
  }
});
</script>
