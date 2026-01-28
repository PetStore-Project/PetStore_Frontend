<template>
  <div class="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-black text-slate-900">Top Selling Products</h3>
      <div class="relative">
        <button 
          @click="showFilterMenu = !showFilterMenu" 
          class="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
        >
          {{ modelValue }}
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
        
        <!-- Dropdown -->
        <div v-if="showFilterMenu" class="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20 overflow-hidden">
          <button 
            v-for="opt in ['All Time', 'Today', 'This Week', 'This Month', 'This Year']" 
            :key="opt"
            @click="$emit('update:modelValue', opt); showFilterMenu = false"
            class="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition"
            :class="{'text-emerald-600 bg-emerald-50': modelValue === opt}"
          >
            {{ opt }}
          </button>
        </div>
        <div v-if="showFilterMenu" @click="showFilterMenu = false" class="fixed inset-0 z-10 cursor-default"></div>
      </div>
    </div>
    
    <div class="space-y-5">
      <div v-for="(p, i) in products" :key="i" class="flex flex-col gap-2">
        <div class="flex justify-between text-sm font-bold text-slate-700">
          <span>{{ p.name }}</span>
          <span>{{ p.qty }} sold</span>
        </div>
        <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div class="h-full bg-slate-800 rounded-full" :style="{ width: p.percent + '%' }"></div>
        </div>
      </div>
      <div v-if="products.length === 0" class="flex flex-col items-center justify-center py-8 text-center">
        <div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
        </div>
        <p class="text-slate-400 text-sm font-medium">No products sold yet</p>
        <p class="text-slate-300 text-xs mt-1">Sales data will appear here</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'TopProducts',
  props: {
    products: { type: Array as () => any[], required: true },
    modelValue: { type: String, required: true }
  },
  emits: ['update:modelValue'],
  setup() {
    const showFilterMenu = ref(false);
    return { showFilterMenu };
  }
});
</script>
