<template>
  <transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="$emit('close')"></div>
      <div class="relative bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <h3 class="text-xl font-black text-slate-900">{{ isEditing ? 'Edit Campaign' : 'New Campaign' }}</h3>
          <button @click="$emit('close')" class="p-2 bg-slate-50 rounded-full hover:bg-slate-100 text-slate-500">✕</button>
        </div>

        <div class="p-8 space-y-5 overflow-y-auto">
          <!-- Campaign Type Toggle -->
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-3">Campaign Type</label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                @click="localForm.campaignType = 'promo_code'"
                class="p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2"
                :class="localForm.campaignType === 'promo_code' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'"
              >
                <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="localForm.campaignType === 'promo_code' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                </div>
                <span class="text-sm font-bold" :class="localForm.campaignType === 'promo_code' ? 'text-emerald-700' : 'text-slate-600'">Promo Code</span>
                <span class="text-[10px] text-slate-400">User enters code at checkout</span>
              </button>
              <button
                type="button"
                @click="localForm.campaignType = 'product_discount'"
                class="p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2"
                :class="localForm.campaignType === 'product_discount' ? 'border-purple-500 bg-purple-50' : 'border-slate-200 hover:border-slate-300'"
              >
                 <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="localForm.campaignType === 'product_discount' ? 'bg-purple-500 text-white' : 'bg-slate-100 text-slate-400'">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <span class="text-sm font-bold" :class="localForm.campaignType === 'product_discount' ? 'text-purple-700' : 'text-slate-600'">Product Discount</span>
                <span class="text-[10px] text-slate-400">Auto-applies to selected products</span>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">
              {{ localForm.campaignType === 'product_discount' ? 'Discount Name' : 'Discount Code' }}
            </label>
            <input v-model="localForm.code" type="text" :placeholder="localForm.campaignType === 'product_discount' ? 'e.g. SUMMER_SALE' : 'e.g. WELCOME20'" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 uppercase" :disabled="isEditing" />
            <p v-if="isEditing" class="text-xs text-slate-400 mt-1">Code cannot be changed after creation.</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Type</label>
              <select v-model="localForm.type" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none">
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Value</label>
              <input v-model.number="localForm.value" type="number" placeholder="20" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Start Date</label>
              <input v-model="localForm.startDate" type="date" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 focus:outline-none" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-2">End Date</label>
              <input v-model="localForm.endDate" type="date" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 focus:outline-none" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Usage Limit (0 = Unlimited)</label>
            <input v-model.number="localForm.usageLimit" type="number" placeholder="0" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none" />
          </div>

          <!-- Applicable Products (Multi-select) -->
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Applicable Products</label>
            <div class="relative">
              <button
                @click="showProductDropdown = !showProductDropdown"
                type="button"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 focus:outline-none text-left flex justify-between items-center"
              >
                <span v-if="localForm.applicableProducts.length === 0" class="text-slate-400">All products (no restriction)</span>
                <span v-else>{{ localForm.applicableProducts.length }} products selected</span>
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>

              <div v-if="showProductDropdown" class="absolute z-20 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                <div v-if="products.length === 0" class="p-4 text-center text-slate-400 text-sm">Loading products...</div>
                <label v-for="product in products" :key="product._id" class="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition">
                  <input type="checkbox" :value="product._id" v-model="localForm.applicableProducts" class="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500">
                  <span class="text-sm font-medium text-slate-700 truncate">{{ product.name }}</span>
                  <span class="text-xs text-slate-400 ml-auto">{{ formatMoney(product.price) }}</span>
                </label>
              </div>
            </div>
            <p class="text-xs text-slate-400 mt-1">Leave empty to apply to all products.</p>
          </div>

          <!-- Minimum Purchase -->
          <div v-if="localForm.campaignType === 'promo_code'">
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Minimum Purchase Amount</label>
            <input v-model.number="localForm.minPurchase" type="number" placeholder="0" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none" />
            <p class="text-xs text-slate-400 mt-1">Set to 0 for no minimum requirement.</p>
          </div>
        </div>

        <div class="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button @click="$emit('close')" class="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition">Cancel</button>
          <button @click="$emit('save', localForm)" class="px-8 py-3 rounded-xl bg-slate-900 text-white font-bold shadow-lg hover:bg-slate-800 transition">
            {{ isEditing ? 'Update Campaign' : 'Create Code' }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'PromotionFormModal',
  props: {
    isOpen: { type: Boolean, required: true },
    isEditing: { type: Boolean, default: false },
    form: { type: Object, required: true },
    products: { type: Array as () => any[], default: () => [] }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const showProductDropdown = ref(false);
    const formatMoney = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);

    const localForm = ref({ ...props.form });

    watch(() => props.form, (newVal) => { localForm.value = { ...newVal }; }, { deep: true });

    return { showProductDropdown, formatMoney, localForm };
  }
});
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
