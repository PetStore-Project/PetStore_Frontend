<template>
  <div class="lg:col-span-2 bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-black text-slate-900">Revenue Analytics</h3>
      <div class="flex bg-slate-100 rounded-xl p-1 gap-1">
        <button
          v-for="mode in (['daily', 'monthly', 'yearly'] as const)"
          :key="mode"
          @click="$emit('update:mode', mode)"
          class="px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition-all"
          :class="currentMode === mode ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
        >
          {{ mode }}
        </button>
      </div>
    </div>

    <div class="overflow-x-auto pt-12 pb-2">
      <div class="flex gap-4 min-w-[600px]">
        <div class="flex flex-col justify-between text-xs font-medium text-slate-400 w-16 text-right h-64 sticky left-0 bg-white/95 backdrop-blur-sm z-20">
          <span>{{ formatChartValue(maxValue) }}</span>
          <span>{{ formatChartValue(maxValue * 0.75) }}</span>
          <span>{{ formatChartValue(maxValue * 0.5) }}</span>
          <span>{{ formatChartValue(maxValue * 0.25) }}</span>
          <span>$0</span>
        </div>

        <div 
          class="relative h-64 w-full"
          @mousemove="handleHover"
          @mouseleave="hoverIndex = -1"
        >
          <div class="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div v-for="i in 5" :key="i" class="w-full h-px bg-slate-100"></div>
          </div>

          <svg class="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="#10B981" stop-opacity="0.2"/>
                <stop offset="100%" stop-color="#10B981" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <path :d="areaPath" fill="url(#chartGradient)" />
            <path :d="linePath" fill="none" stroke="#10B981" stroke-width="3" stroke-linecap="round" vector-effect="non-scaling-stroke" />

            <!-- Hover Vertical Line (SVG for crisp rendering) -->
            <line
              v-if="hoverIndex >= 0 && chartPoints[hoverIndex]"
              :x1="chartPoints[hoverIndex]?.x"
              y1="0"
              :x2="chartPoints[hoverIndex]?.x"
              y2="100"
              stroke="#10B981"
              stroke-width="1"
              vector-effect="non-scaling-stroke"
              opacity="0.8"
            />
          </svg>

          <div
            v-if="hoverIndex >= 0 && peakValleyIndices.includes(hoverIndex) && chartPoints[hoverIndex]"
            class="absolute w-4 h-4 bg-white border-[3px] border-emerald-500 rounded-full shadow-md transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
            :style="{
              left: `${chartPoints[hoverIndex]?.x}%`,
              top: `${chartPoints[hoverIndex]?.y}%`
            }"
          ></div>

          <div
            v-for="(point, i) in chartPoints"
            :key="i"
            class="absolute w-2 h-2 bg-emerald-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity"
            :class="{ 'opacity-0': hoverIndex === i && peakValleyIndices.includes(i) }"
            :style="{
              left: `${point.x}%`,
              top: `${point.y}%`
            }"
          ></div>

          <div
            v-if="hoverIndex >= 0"
            class="absolute top-0 bottom-0 pointer-events-none z-10"
            :style="{ left: `${(hoverIndex * (100 / Math.max(labels.length, 1))) + (100 / Math.max(labels.length, 1) / 2)}%` }"
          >
            <!-- Line removed, moved to SVG -->
            <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap">
              {{ formatMoney(dataPoints[hoverIndex] || 0) }}
              <div class="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
            </div>
            
             <!-- Date Label -->
            <div
              class="absolute -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow"
              :style="{ bottom: '-42px' }"
            >
              {{ labels[hoverIndex] }}
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-4 mt-4 min-w-[600px]">
        <div class="w-16 sticky left-0 z-20 bg-white/95"></div>
        <div class="flex-1 flex text-xs font-semibold text-slate-400">
          <span v-for="(label, idx) in labels" :key="idx" class="text-center flex-1" :class="{'opacity-0': hoverIndex === idx}">{{ label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';

export default defineComponent({
  name: 'RevenueChart',
  props: {
    dataPoints: { type: Array as () => number[], required: true },
    labels: { type: Array as () => string[], required: true },
    currentMode: { type: String, required: true }
  },
  emits: ['update:mode'],
  setup(props) {
    const hoverIndex = ref(-1);

    // --- CHART SCALING LOGIC ---
    const maxValue = computed(() => {
      // Logic from user reference: round up to nice magnitude
      const max = Math.max(...props.dataPoints, 100);
      const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
      return Math.ceil(max / magnitude) * magnitude;
    });

    const formatChartValue = (n: number) => {
      if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
      if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
      return `$${n.toFixed(0)}`;
    };

    const formatMoney = (val: number) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    const handleHover = (e: MouseEvent) => {
       const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
       const x = e.clientX - rect.left;
       const width = rect.width;
       const count = props.labels.length;
       const step = width / count;
       hoverIndex.value = Math.floor(x / step);
    };

    const chartPoints = computed(() => {
       const max = maxValue.value || 1;
       const count = props.dataPoints.length;
       if (count === 0) return [];
       
       const stepX = 100 / count;
       return props.dataPoints.map((val, i) => ({
         x: (i * stepX) + (stepX / 2),
         y: 100 - ((val / max) * 100),
         val
       }));
    });

    // --- SVG PATH CALCULATION ---
    const linePath = computed(() => {
      if (chartPoints.value.length === 0) return '';
      // User reference uses "M 0,100 L ..." logic for area stability but for linepath:
      const pointsStr = chartPoints.value.map(p => `${p.x},${p.y}`).join(" L ");
      // Anchor to bottom-left (0,100) to ensure line is visible even for single point? 
      // User ref: return `M 0,100 L ${data.join(" L ")}`; 
      // This draws a line from bottom left to first point? 
      // Actually standard line chart usually just connects points. 
      // However, the user reference explicitly does `M 0,100 L ...`. 
      // This creates a line from 0,100 to first point. I will follow standard point-to-point for cleaner look OR follow reference.
      // Reference snippet: `return M 0,100 L ${data.join(" L ")}`;
      // If I want EXACT look I should follow. But M 0,100 might be an artifact of their area logic.
      // Let's stick to connecting points for the LINE.
      return chartPoints.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    });

    const areaPath = computed(() => {
       if (!linePath.value) return '';
       const points = chartPoints.value;
       const lastX = points[points.length - 1]?.x;
       const firstX = points[0]?.x;
       if (lastX === undefined || firstX === undefined) return '';
       return `${linePath.value} L ${lastX} 100 L ${firstX} 100 Z`; 
    });

    const peakValleyIndices = computed(() => {
      const series = props.dataPoints;
      const indices: number[] = [];
      if (series.length > 0) indices.push(0);

      for (let i = 1; i < series.length - 1; i++) {
        const prev = series[i - 1];
        const curr = series[i];
        const next = series[i + 1];
        
        if (prev === undefined || curr === undefined || next === undefined) continue;

        if ((curr > prev && curr > next) || (curr < prev && curr < next)) {
          indices.push(i);
        }
      }

      if (series.length > 1) indices.push(series.length - 1);
      return indices;
    });

    return { 
      maxValue, formatChartValue, formatMoney, hoverIndex, handleHover, 
      linePath, areaPath, chartPoints, peakValleyIndices 
    };
  }
});
</script>
