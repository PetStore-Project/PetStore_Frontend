<template>
  <div class="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[400px]">

    <div v-if="isLoading" class="flex-1 flex flex-col items-center justify-center p-12">
       <div class="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-emerald-500"></div>
       <p class="mt-4 text-sm font-bold text-slate-400">Loading orders...</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
            <th class="py-4 px-6">Order ID</th>
            <th class="py-4 px-4">Customer</th>
            <th class="py-4 px-4">Date</th>
            <th class="py-4 px-4">Total</th>
            <th class="py-4 px-4">Status</th>
            <th class="py-4 px-6 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-if="orders.length === 0">
            <td colspan="6" class="py-20 text-center">
              <div class="flex flex-col items-center">
                <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                </div>
                <p class="text-slate-500 font-bold">No orders found</p>
                <p class="text-slate-400 text-xs mt-1">Try changing your filters</p>
              </div>
            </td>
          </tr>
          <tr v-for="o in orders" :key="o.id" class="group hover:bg-slate-50 transition cursor-pointer" @click="$emit('view-details', o)">

            <td class="py-4 px-6">
              <span class="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">#{{ o.id.slice(-6).toUpperCase() }}</span>
            </td>

            <td class="py-4 px-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xs font-black text-slate-600 border border-white shadow-sm">
                  {{ initials(o.customer) }}
                </div>
                <div>
                  <div class="text-sm font-bold text-slate-900">{{ o.customer }}</div>
                  <div class="text-[11px] font-medium text-slate-400">{{ o.email }}</div>
                </div>
              </div>
            </td>

            <td class="py-4 px-4 text-sm font-semibold text-slate-600">{{ formatDate(o.date) }}</td>
            <td class="py-4 px-4 text-sm font-black text-slate-900">{{ formatMoney(o.total) }}</td>

            <td class="py-4 px-4" @click.stop>
              <!-- Show locked badge for finalized orders -->
              <div v-if="o.status === 'Cancelled' || o.status === 'Delivered'" class="flex items-center gap-2">
                 <StatusBadge :status="o.status" show-dot>
                   {{ o.status }}
                 </StatusBadge>
                 <svg class="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>
              </div>
              <!-- Show dropdown for active orders -->
              <div v-else class="relative inline-block">
                <select
                  :value="o.status"
                  @change="$emit('update-status', o, $event)"
                  class="appearance-none pl-3 pr-7 py-1.5 rounded-lg text-xs font-bold border outline-none cursor-pointer transition-colors focus:ring-2 focus:ring-offset-1 focus:ring-slate-200"
                  :class="[statusPill(o.status), { 'opacity-50 cursor-not-allowed': (!o.isPaid && o.paymentMethod !== 'COD') || o.status === 'Cancelled' || o.status === 'Delivered' }]"
                  :disabled="(!o.isPaid && o.paymentMethod !== 'COD') || o.status === 'Cancelled' || o.status === 'Delivered'"
                >
                   <option value="Pending">Pending</option>
                   <option value="Processing">Processing</option>
                   <option value="Shipped">Shipped</option>
                   <option value="Delivered">Delivered</option>
                   <option value="Cancelled">Cancelled</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-1.5 flex items-center">
                  <svg class="h-3 w-3 text-current opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </td>

            <td class="py-4 px-6 text-right">
              <div class="flex gap-2 justify-end">
                <button
                  class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  @click.stop="$emit('view-details', o)"
                >
                  View Details
                </button>
                <button
                  class="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1"
                  @click.stop="$emit('generate-invoice', o)"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  Invoice
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination slot for flexibility -->
    <slot name="pagination"></slot>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import StatusBadge from '@/components/UI/StatusBadge.vue';

export default defineComponent({
  name: 'OrdersTable',
  components: { StatusBadge },
  props: {
    orders: { type: Array as () => any[], required: true },
    isLoading: { type: Boolean, default: false }
  },
  emits: ['view-details', 'update-status', 'generate-invoice'],
  setup() {
    const formatDate = (dateString: string) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    };

    const formatMoney = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD'
      }).format(amount || 0);
    };

    const initials = (name: string) => {
      if (!name) return '??';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const statusPill = (status: string) => {
      const map: Record<string, string> = {
        Paid: "bg-emerald-50 text-emerald-700 border-emerald-100",
        Pending: "bg-amber-50 text-amber-700 border-amber-100",
        Shipped: "bg-blue-50 text-blue-700 border-blue-100",
        Delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
        Cancelled: "bg-rose-50 text-rose-700 border-rose-100",
        Processing: "bg-indigo-50 text-indigo-700 border-indigo-100",
        Refunded: "bg-purple-50 text-purple-700 border-purple-100"
      };
      return map[status] || "bg-slate-50 text-slate-700 border-slate-100";
    };

    return { formatDate, formatMoney, initials, statusPill };
  }
});
</script>
