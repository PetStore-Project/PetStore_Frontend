<template>
  <transition name="fade">
    <div v-if="order" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="$emit('close')"></div>
      <div class="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h3 class="text-xl font-black text-slate-900">Order Details</h3>
            <div class="flex items-center gap-3 mt-1">
              <p class="text-xs font-bold text-slate-400 font-mono">ID: #{{ order.id.slice(-8).toUpperCase() }}</p>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" :class="order.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'">
                {{ order.isPaid ? 'PAID' : 'UNPAID' }}
              </span>
            </div>
          </div>
          <button @click="$emit('close')" class="p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-8 overflow-y-auto flex flex-col gap-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Customer</h4>
              <div class="flex items-center gap-3">
                 <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-sm font-black text-slate-700 border border-slate-200 shadow-sm">{{ initials(order.customer) }}</div>
                 <div><p class="font-bold text-slate-900 text-sm">{{ order.customer }}</p><p class="text-xs text-slate-500">{{ order.email }}</p></div>
              </div>
            </div>
            <div class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Shipping Address</h4>
              <p class="text-sm font-medium text-slate-700 leading-relaxed">{{ order.shippingAddress?.address || 'N/A' }}<br>{{ order.shippingAddress?.city }}, {{ order.shippingAddress?.postalCode }}</p>
            </div>
          </div>
          <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div class="px-5 py-3 bg-slate-50 border-b border-slate-100"><h4 class="text-xs font-bold text-slate-500 uppercase tracking-wide">Order Items ({{ order.orderItems?.length || 0 }})</h4></div>
            <div class="divide-y divide-slate-100">
              <div v-for="(item, idx) in order.orderItems" :key="idx" class="flex items-center gap-4 p-4 hover:bg-slate-50 transition">
                <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden"><img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover"><svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg></div>
                <div class="flex-1 min-w-0"><p class="font-bold text-slate-900 text-sm truncate">{{ item.name }}</p><p class="text-xs text-slate-500">Qty: {{ item.quantity }} × {{ formatMoney(item.price) }}</p></div>
                <p class="font-bold text-slate-900 text-sm">{{ formatMoney(item.price * item.quantity) }}</p>
              </div>
            </div>
            <div class="px-5 py-3 bg-slate-900 text-white flex justify-between items-center font-bold font-sans">
              <span>Total Amount</span><span class="text-lg font-black">{{ formatMoney(order.total) }}</span>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-3">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Status</label>
              <div class="flex items-center gap-3">
                <div class="flex-1 px-4 py-3 rounded-xl text-sm font-bold border" :class="order.isPaid ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'">{{ order.isPaid ? 'Paid' : 'Awaiting Payment' }}</div>
                <button v-if="!order.isPaid && order.status !== 'Cancelled'" @click="$emit('mark-paid', order)" class="px-4 py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-100">Mark Paid</button>
              </div>
            </div>
            <div class="space-y-3">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Order Status</label>
              <div class="relative" :title="!order.isPaid ? 'Order must be paid before changing status' : (order.status === 'Cancelled' || order.status === 'Delivered' ? 'Final status cannot be changed' : '')">
                <select :value="order.status" @change="$emit('update-status', order, $event)" :disabled="!order.isPaid || order.status === 'Cancelled' || order.status === 'Delivered'" class="w-full px-4 py-3 rounded-xl text-sm font-bold border outline-none appearance-none transition-all" :class="[statusPill(order.status), (!order.isPaid || order.status === 'Cancelled' || order.status === 'Delivered') ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer']">
                  <option v-for="s in ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']" :key="s" :value="s">{{ s }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-current opacity-50"><svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg></div>
              </div>
            </div>
          </div>
          <div class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
             <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Payment Method</h4>
             <p class="text-sm font-bold text-slate-900">{{ order.paymentMethod || 'N/A' }}</p>
          </div>

        </div>
        <div class="p-6 bg-slate-50 border-t border-slate-100 flex flex-wrap justify-between gap-3">
          <div class="flex gap-2">
            <button @click="$emit('generate-invoice', order)" class="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1.017.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>Invoice</button>
            <button v-if="order.status !== 'Cancelled' && order.isPaid" @click="$emit('refund', order)" class="px-5 py-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold hover:bg-rose-100 transition flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>Cancel & Refund</button>
          </div>
          <button @click="$emit('close')" class="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition">Done</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  props: ['order', 'formatMoney', 'formatDate', 'initials', 'statusPill'],
  emits: ['close', 'update-status', 'mark-paid', 'refund', 'generate-invoice']
});
</script>