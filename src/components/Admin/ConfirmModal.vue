<template>
  <transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="close"></div>
      <div class="relative bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden p-8 text-center">
        <!-- Icon -->
        <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" :class="colorClasses.bg">
          <slot name="icon">
             <!-- Default Icon (Exclamation) -->
            <svg class="w-8 h-8" :class="colorClasses.text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </slot>
        </div>

        <h3 class="text-xl font-black text-slate-900 mb-2">{{ title }}</h3>
        
        <div class="text-slate-500 text-sm font-medium mb-6">
          <slot name="message">{{ message }}</slot>
        </div>

        <div class="flex gap-3">
          <button @click="close" class="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition">
            {{ cancelText }}
          </button>
          <button 
            @click="confirm" 
            class="flex-1 px-6 py-3 text-white rounded-xl font-bold shadow-lg transition"
            :class="colorClasses.button"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'ConfirmModal',
  props: {
    isOpen: { type: Boolean, required: true },
    title: { type: String, default: 'Are you sure?' },
    message: { type: String, default: '' },
    confirmText: { type: String, default: 'Confirm' },
    cancelText: { type: String, default: 'Cancel' },
    type: { 
      type: String, 
      default: 'danger', // danger (red), success (emerald), warning (amber), info (blue)
      validator: (val: string) => ['danger', 'success', 'warning', 'info'].includes(val)
    }
  },
  emits: ['close', 'confirm'],
  setup(props, { emit }) {
    const close = () => emit('close');
    const confirm = () => emit('confirm');

    const colorClasses = computed(() => {
      switch (props.type) {
        case 'success':
          return { bg: 'bg-emerald-50', text: 'text-emerald-500', button: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30' };
        case 'warning':
          return { bg: 'bg-amber-50', text: 'text-amber-500', button: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' };
        case 'info':
          return { bg: 'bg-blue-50', text: 'text-blue-500', button: 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/30' };
        case 'danger':
        default:
          return { bg: 'bg-rose-50', text: 'text-rose-500', button: 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30' };
      }
    });

    return { close, confirm, colorClasses };
  }
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
