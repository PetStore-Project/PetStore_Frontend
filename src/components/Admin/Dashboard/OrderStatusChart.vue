<template>
  <div class="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col">
    <h3 class="text-lg font-black text-slate-900 mb-6">Order Status</h3>

    <div class="overflow-x-auto min-h-[300px] flex flex-col justify-center">
      <div class="relative flex-1 flex items-center justify-center min-w-[280px]">
        <svg viewBox="0 0 36 36" class="w-48 h-48 transform -rotate-90 overflow-visible">
          <!-- Background Ring -->
          <path class="text-slate-100" 
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="3.8" 
          />
          
          <!-- Completed Segment (Green) -->
          <path class="text-emerald-500 drop-shadow-lg transition-all duration-1000"
            :stroke-dasharray="`${stats.completedPercent}, 100`"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none" 
            stroke="currentColor" 
            stroke-width="3.8" 
          />
          
          <!-- To Process Segment (Blue) -->
          <path class="text-blue-500 transition-all duration-1000"
            :stroke-dasharray="`${stats.processPercent}, 100`"
            :stroke-dashoffset="`-${stats.completedPercent}`"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none" 
            stroke="currentColor" 
            stroke-width="3.8" 
          />

          <!-- Pending Segment (Amber) -->
          <path class="text-amber-400 transition-all duration-1000"
            :stroke-dasharray="`${stats.pendingPercent}, 100`"
            :stroke-dashoffset="`-${stats.completedPercent + stats.processPercent}`"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none" 
            stroke="currentColor" 
            stroke-width="3.8" 
          />
        </svg>
        <div class="absolute text-center z-10">
          <span class="block text-3xl font-black text-slate-900">{{ stats.orders }}</span>
          <span class="text-xs font-bold text-slate-400 uppercase">Total</span>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-3 mt-8 min-w-[280px]">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span class="text-sm font-bold text-slate-600">Completed</span>
          </div>
          <span class="text-xs font-bold text-slate-400">{{ stats.completedPercent }}%</span>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-blue-500"></div>
            <span class="text-sm font-bold text-slate-600">To Process (Action)</span>
          </div>
          <span class="text-xs font-bold text-slate-400">{{ stats.processPercent }}%</span>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-amber-400"></div>
            <span class="text-sm font-bold text-slate-600">Pending Payment</span>
          </div>
          <span class="text-xs font-bold text-slate-400">{{ stats.pendingPercent }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'OrderStatusChart',
  props: {
    stats: { type: Object, required: true }
  }
});
</script>
