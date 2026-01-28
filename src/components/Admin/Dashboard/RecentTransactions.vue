<template>
  <div class="lg:col-span-2 bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 flex flex-col">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-bold text-slate-900">Recent Transactions</h3>
      <router-link to="/admin/orders" class="text-sm font-bold text-blue-600 hover:underline">View All</router-link>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr class="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
            <th class="pb-3">ID</th>
            <th class="pb-3">Customer</th>
            <th class="pb-3">Date</th>
            <th class="pb-3 text-right">Amount</th>
            <th class="pb-3 text-right">Status</th>
          </tr>
        </thead>
        <tbody class="text-sm font-medium text-slate-600">
          <tr v-if="orders.length === 0">
            <td colspan="5" class="py-6 text-center text-slate-400">No orders yet</td>
          </tr>
          <tr v-for="order in orders" :key="order._id" class="group hover:bg-slate-50 transition-colors">
            <td class="py-3 border-b border-slate-50 font-mono text-slate-400 text-xs">#{{ order._id.slice(-6).toUpperCase() }}</td>
            <td class="py-3 border-b border-slate-50 text-slate-900 font-bold">
              {{ order.user ? order.user.firstName + ' ' + order.user.lastName : 'Guest' }}
            </td>
            <td class="py-3 border-b border-slate-50 text-slate-500">{{ formatDate(order.createdAt) }}</td>
            <td class="py-3 text-right text-slate-900 font-bold border-b border-slate-50">{{ formatMoney(order.totalPrice) }}</td>
            <td class="py-3 text-right border-b border-slate-50">
              <span class="px-2 py-1 rounded-lg text-[10px] font-bold border" :class="statusClass(order.status)">
                {{ order.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RecentTransactions',
  props: {
    orders: { type: Array as () => any[], required: true }
  },
  setup() {
    const formatDate = (iso: string) => {
      return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    const formatMoney = (val: number) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

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

    return { formatDate, formatMoney, statusClass };
  }
});
</script>
