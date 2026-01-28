<template>
  <div class="border-t border-slate-100 p-4 bg-slate-50 flex items-center justify-between rounded-b-[32px]">
    <span class="text-xs font-semibold text-slate-500">
      Showing page {{ currentPage }} of {{ totalPages }}
    </span>
    <div class="flex gap-2">
      <button 
        :disabled="currentPage === 1" 
        @click="$emit('update:currentPage', currentPage - 1)" 
        class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 disabled:opacity-50 hover:bg-slate-50 transition-colors"
      >
        Previous
      </button>
      <button 
        :disabled="currentPage === totalPages" 
        @click="$emit('update:currentPage', currentPage + 1)" 
        class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 disabled:opacity-50 hover:bg-slate-50 transition-colors"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AdminPagination',
  props: {
    currentPage: { type: Number, required: true },
    totalPages: { type: Number, required: true }
  },
  emits: ['update:currentPage']
});
</script>
