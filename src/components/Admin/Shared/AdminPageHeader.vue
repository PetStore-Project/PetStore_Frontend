<template>
  <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
    <div>
      <h1 class="text-3xl font-black text-slate-900 tracking-tight">{{ title }}</h1>
      <p v-if="description" class="text-slate-500 mt-1 font-medium">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="flex gap-3">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AdminPageHeader',
  props: {
    title: { type: String, required: true },
    description: { type: String, default: '' }
  }
});
</script>
