<template>
  <transition name="fade">
    <div v-if="isOpen && user" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="$emit('close')"></div>
      <div class="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h3 class="text-xl font-black text-slate-900">Customer Details</h3>
            <p class="text-xs font-bold text-slate-400 mt-1">{{ user.email }}</p>
          </div>
          <button @click="$emit('close')" class="p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div class="p-8 overflow-y-auto flex flex-col gap-6">

          <!-- User Info Card -->
          <div class="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-16 h-16 rounded-full bg-[#CBDAAF] text-slate-800 flex items-center justify-center font-black text-2xl shadow-sm border-2 border-white">
                {{ user.firstName?.[0] || '?' }}
              </div>
              <div>
                <p class="font-black text-slate-900 text-lg">{{ user.firstName }} {{ user.lastName }}</p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize"
                    :class="user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'">
                    {{ user.role }}
                  </span>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                    :class="user.isBlocked ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'">
                    {{ user.isBlocked ? 'Blocked' : 'Active' }}
                  </span>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200/50">
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase">Email</p>
                <p class="text-sm font-bold text-slate-900">{{ user.email }}</p>
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase">Member Since</p>
                <p class="text-sm font-bold text-slate-900">{{ formatDate(user.createdAt) }}</p>
              </div>
            </div>
          </div>

          <!-- Order History -->
          <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div class="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wide">Order History</h4>
              <span class="px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full text-[10px] font-bold">
                {{ orders.length }} orders
              </span>
            </div>
            <div class="divide-y divide-slate-100 max-h-64 overflow-y-auto">
              <div v-if="loadingOrders" class="p-8 flex justify-center">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
              </div>
              <div v-else-if="orders.length === 0" class="p-6 text-center text-slate-400 text-sm">
                No orders found for this customer.
              </div>
              <div v-else v-for="order in orders" :key="order._id" class="flex items-center justify-between p-4 hover:bg-slate-50 transition">
                <div>
                  <p class="font-mono text-xs font-bold text-slate-500">#{{ order._id.slice(-6).toUpperCase() }}</p>
                  <p class="text-xs text-slate-400 mt-0.5">{{ formatDate(order.createdAt) }}</p>
                </div>
                <div class="flex items-center gap-3">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border" :class="statusClass(order.status)">
                    {{ order.status }}
                  </span>
                  <span class="font-black text-slate-900 text-sm">{{ formatMoney(order.totalPrice) }}</span>
                </div>
              </div>
            </div>
            <div v-if="orders.length > 0" class="px-5 py-3 bg-slate-900 text-white flex justify-between items-center">
              <span class="font-bold text-sm">Total Spent</span>
              <span class="font-black text-lg">{{ formatMoney(totalSpent) }}</span>
            </div>
          </div>

          <!-- Admin Notes -->
          <div class="space-y-3">
            <label class="text-xs font-bold text-slate-500 uppercase">Admin Notes</label>
            <textarea 
              :value="notes"
              @input="$emit('update:notes', ($event.target as HTMLTextAreaElement).value)"
              @blur="$emit('save-notes')"
              rows="3"
              placeholder="Add notes about this customer..."
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition resize-none"
            ></textarea>
          </div>

        </div>

        <div class="p-6 bg-slate-50 border-t border-slate-100 flex justify-between gap-3">
          <button 
            v-if="user.role !== 'admin'"
            @click="$emit('toggle-block')"
            class="px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2"
            :class="user.isBlocked ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-rose-600 text-white hover:bg-rose-700'"
          >
             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="user.isBlocked" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
              </svg>
             {{ user.isBlocked ? 'Unblock User' : 'Block User' }}
          </button>
          <div v-else></div>
          <button @click="$emit('close')" class="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition">
            Done
          </button>
        </div>

      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'CustomerDetailsModal',
  props: {
    isOpen: { type: Boolean, required: true },
    user: { type: Object, default: null },
    orders: { type: Array as () => any[], default: () => [] },
    loadingOrders: { type: Boolean, default: false },
    notes: { type: String, default: '' }
  },
  emits: ['close', 'update:notes', 'save-notes', 'toggle-block'],
  setup(props) {
    const formatDate = (iso: string) => {
      if (!iso) return '-';
      return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };
    const formatMoney = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);

    const totalSpent = computed(() => props.orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0));

    const statusClass = (status: string) => {
      const map: Record<string, string> = {
        'Paid': 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'Pending': 'bg-amber-50 text-amber-700 border-amber-100',
        'Shipped': 'bg-blue-50 text-blue-700 border-blue-100',
        'Delivered': 'bg-emerald-100 text-emerald-800 border-emerald-200',
        'Cancelled': 'bg-rose-50 text-rose-700 border-rose-100',
        'Processing': 'bg-indigo-50 text-indigo-700 border-indigo-100'
      };
      return map[status] || 'bg-slate-50 text-slate-700 border-slate-100';
    };

    return { formatDate, formatMoney, totalSpent, statusClass };
  }
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
