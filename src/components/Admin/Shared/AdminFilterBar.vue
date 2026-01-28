<template>
  <div class="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
    
    <!-- Search Input -->
    <div class="relative w-full md:w-96">
      <svg class="absolute left-4 top-3.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        type="text"
        :placeholder="placeholder"
        class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
      >
    </div>

    <!-- Extra Filters Slot -->
    <slot></slot>

    <!-- Reset Button -->
    <button
      v-if="showReset"
      @click="$emit('reset')"
      class="text-xs font-bold text-red-500 hover:text-red-700 px-4 py-2 whitespace-nowrap"
    >
      Reset Filters
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AdminFilterBar',
  props: {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: 'Search...' },
    showReset: { type: Boolean, default: false }
  },
  emits: ['update:modelValue', 'reset']
});
</script>
