<template>
  <transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

      <div class="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

        <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h3 class="text-xl font-black text-slate-900">{{ isEditing ? 'Edit Product' : 'Add New Product' }}</h3>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">Product Details</p>
          </div>
          <button @click="$emit('close')" class="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition text-slate-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div class="p-8 overflow-y-auto custom-scrollbar space-y-6">

          <div class="space-y-3">
            <label class="block text-sm font-bold text-slate-700">Product Image</label>
            <div
              class="relative border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all hover:border-emerald-400 hover:bg-emerald-50/30 group cursor-pointer"
              @click="triggerFileInput"
            >
              <input type="file" ref="fileInput" class="hidden" @change="handleFileSelect" accept="image/*">

              <div v-if="previewImage" class="relative w-40 h-40 mb-4">
                <img :src="previewImage" class="w-full h-full object-contain rounded-xl shadow-sm border border-slate-100 bg-white p-2">
                <button @click.stop="removeImage" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>

              <div v-else class="flex flex-col items-center">
                <div class="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <p class="text-sm font-bold text-slate-900">Click to upload image</p>
                <p class="text-xs text-slate-400 mt-1">SVG, PNG, JPG (max. 2MB)</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-500 uppercase">Product Name</label>
              <input v-model="localForm.name" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition" placeholder="e.g. Premium Dog Food">
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-500 uppercase">Category</label>
              <select v-model="localForm.category" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition appearance-none">
                <option>Food</option>
                <option>Toys</option>
                <option>Furniture</option>
                <option>Accessories</option>
                <option>Treats</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-500 uppercase">Price ($)</label>
              <input v-model.number="localForm.price" type="number" step="0.01" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition" placeholder="0.00">
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-500 uppercase">Stock Quantity</label>
              <input v-model.number="localForm.stockQuantity" type="number" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition" placeholder="0">
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-500 uppercase">Description</label>
            <textarea v-model="localForm.description" rows="3" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition resize-none" placeholder="Describe the product..."></textarea>
          </div>

        </div>

        <div class="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button @click="$emit('close')" class="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition">Cancel</button>
          <button @click="$emit('save', localForm)" :disabled="isSaving" class="px-8 py-3 rounded-xl bg-slate-900 text-white font-bold shadow-lg hover:bg-slate-800 transition disabled:opacity-70 flex items-center gap-2">
            <span v-if="isSaving" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            {{ isSaving ? 'Saving...' : 'Save Product' }}
          </button>
        </div>

      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'ProductFormModal',
  props: {
    isOpen: { type: Boolean, required: true },
    isEditing: { type: Boolean, default: false },
    isSaving: { type: Boolean, default: false },
    form: { type: Object, required: true },
    previewImage: { type: String, default: null }
  },
  emits: ['close', 'save', 'select-file', 'remove-image'],
  setup(props, { emit }) {
    const fileInput = ref<HTMLInputElement | null>(null);
    const localForm = ref({ ...props.form });

    watch(() => props.form, (newVal) => { localForm.value = { ...newVal }; }, { deep: true });

    const triggerFileInput = () => fileInput.value?.click();

    // Forward file selection to parent
    const handleFileSelect = (event: Event) => {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            emit('select-file', input.files[0]);
        }
    };

    const removeImage = () => {
        emit('remove-image');
        if (fileInput.value) fileInput.value.value = '';
    };

    return { fileInput, triggerFileInput, handleFileSelect, removeImage, localForm };
  }
});
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
</style>
