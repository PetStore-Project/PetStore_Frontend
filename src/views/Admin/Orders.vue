<template>
  <div class="w-full min-h-screen bg-slate-50 flex flex-col font-sans">
    <main class="flex-1 w-full overflow-y-auto px-4 sm:px-8 pt-8 pb-10">

      <section class="relative rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
        <div class="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-slate-50 opacity-60 rounded-3xl"></div>
        <div class="relative p-6 sm:p-8">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div class="min-w-0">
              <h1 class="mt-3 text-3xl font-black text-slate-900 tracking-tight">Orders Center</h1>
              <p class="mt-2 text-sm text-slate-600 max-w-xl">Track revenue and manage order fulfillment in real-time.</p>
            </div>
            
            <div class="flex flex-wrap items-center gap-3 sm:gap-4 pb-2 sm:pb-0">
              <button @click="fetchOrders" class="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
                <svg v-if="isLoading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span v-else>Refresh</span>
              </button>

              <div class="relative">
                <button @click="showExportMenu = !showExportMenu" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  Export CSV
                </button>
                <div v-if="showExportMenu" class="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden">
                  <button v-for="opt in exportOptions" :key="opt" @click="exportCSV(opt); showExportMenu = false" class="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">{{ opt }}</button>
                </div>
                <div v-if="showExportMenu" @click="showExportMenu = false" class="fixed inset-0 z-40"></div>
              </div>

              <div class="relative">
                <button @click="showReportMenu = !showReportMenu" class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1.017.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  Revenue Report
                </button>
                <div v-if="showReportMenu" class="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden">
                  <button v-for="opt in exportOptions" :key="opt" @click="generateFinancialReport(opt); showReportMenu = false" class="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">{{ opt }}</button>
                </div>
                <div v-if="showReportMenu" @click="showReportMenu = false" class="fixed inset-0 z-40"></div>
              </div>
            </div>
          </div>

          <div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:flex lg:overflow-x-auto lg:gap-4 lg:pb-4 xl:grid xl:grid-cols-6 xl:pb-0">
            <div class="min-w-[140px] rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex-1">
              <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Total Orders</p>
              <p class="mt-1 text-2xl font-black text-slate-900 tracking-tighter">{{ stats.total }}</p>
            </div>
            <div class="min-w-[140px] rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex-1">
              <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Revenue</p>
              <p class="mt-1 text-2xl font-black text-slate-900 tracking-tighter">{{ formatMoney(stats.revenue) }}</p>
            </div>
            <div class="min-w-[140px] rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-sm cursor-pointer hover:bg-emerald-50 transition flex-1" @click="activePaymentFilter = 'paid'; activeStatus = 'all'; page = 1">
              <p class="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">Paid</p>
              <p class="mt-1 text-2xl font-black text-emerald-600 tracking-tighter">{{ stats.paidCount }}</p>
            </div>
            <div class="min-w-[140px] rounded-2xl border border-amber-100 bg-amber-50/50 p-4 shadow-sm cursor-pointer hover:bg-amber-50 transition flex-1" @click="activePaymentFilter = 'unpaid'; activeStatus = 'all'; page = 1">
              <p class="text-[11px] font-bold text-amber-600 uppercase tracking-wide">Unpaid</p>
              <p class="mt-1 text-2xl font-black text-amber-500 tracking-tighter">{{ stats.unpaidCount }}</p>
            </div>
            <div class="min-w-[140px] rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex-1">
              <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Pending</p>
              <p class="mt-1 text-2xl font-black text-slate-900 tracking-tighter">{{ stats.pending }}</p>
            </div>
            <div class="min-w-[140px] rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex-1">
              <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Delivered</p>
              <p class="mt-1 text-2xl font-black text-slate-900 tracking-tighter">{{ stats.delivered }}</p>
            </div>
          </div>
        </div>
      </section>

      <div class="pt-8 flex flex-col gap-6">
        <section class="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden p-2">
          <div class="p-2 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div class="flex flex-wrap gap-1">
              <button v-for="t in statusTabs" :key="t.key" @click="activeStatus = t.key; activePaymentFilter = 'all'; page = 1" class="px-3 py-2 rounded-xl text-xs font-bold transition border" :class="activeStatus === t.key ? 'bg-[#0f172a] text-white border-[#0f172a] shadow-md' : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-50'">
                {{ t.label }} <span class="ml-1 px-1.5 py-0.5 rounded-md text-[10px]" :class="activeStatus === t.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'">{{ t.count }}</span>
              </button>
            </div>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div class="flex bg-slate-100 rounded-xl p-1 gap-1 overflow-x-auto min-w-0">
                <button v-for="f in ['all', 'paid', 'unpaid']" :key="f" @click="activePaymentFilter = f; page = 1" class="px-3 py-1.5 rounded-lg text-xs font-bold transition capitalize" :class="activePaymentFilter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'">{{ f === 'all' ? 'All Payment' : f }}</button>
              </div>
              <div class="relative w-full sm:w-64 group">
                <input v-model.trim="q" type="text" placeholder="Search ID or Customer..." class="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all"/>
              </div>
            </div>
          </div>
        </section>

        <section class="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          <div v-if="isLoading" class="flex-1 flex flex-col items-center justify-center p-12"><div class="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-emerald-500"></div></div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead><tr class="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-400 font-bold"><th class="py-4 px-6">Order ID</th><th class="py-4 px-4">Customer</th><th class="py-4 px-4">Date</th><th class="py-4 px-4">Total</th><th class="py-4 px-4">Status</th><th class="py-4 px-6 text-right">Action</th></tr></thead>
              <tbody class="divide-y divide-slate-50">
                <tr v-for="o in paged" :key="o.id" class="group hover:bg-slate-50 transition cursor-pointer" @click="openDetails(o)">
                  <td class="py-4 px-6"><span class="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">#{{ o.id.slice(-6).toUpperCase() }}</span></td>
                  <td class="py-4 px-4"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xs font-black text-slate-600 border border-white shadow-sm">{{ initials(o.customer) }}</div><div><div class="text-sm font-bold text-slate-900">{{ o.customer }}</div><div class="text-[11px] font-medium text-slate-400">{{ o.email }}</div></div></div></td>
                  <td class="py-4 px-4 text-sm font-semibold text-slate-600">{{ formatDate(o.date) }}</td>
                  <td class="py-4 px-4 text-sm font-black text-slate-900">{{ formatMoney(o.total) }}</td>
                  <td class="py-4 px-4" @click.stop>
                    <StatusBadge v-if="o.status === 'Cancelled' || o.status === 'Delivered'" :status="o.status" :showDot="true">{{ o.status }}</StatusBadge>
                    <div v-else class="relative inline-block">
                      <select :value="o.status" @change="updateStatus(o, $event)" class="appearance-none pl-3 pr-7 py-1.5 rounded-lg text-xs font-bold border outline-none cursor-pointer transition-colors" :class="statusPill(o.status)">
                        <option v-for="s in ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']" :key="s" :value="s">{{ s }}</option>
                      </select>
                      <div class="pointer-events-none absolute inset-y-0 right-1.5 flex items-center"><svg class="h-3 w-3 text-current opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" /></svg></div>
                    </div>
                  </td>
                  <td class="py-4 px-6 text-right"><div class="flex gap-2 justify-end"><button class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition" @click.stop="openDetails(o)">View Details</button><button class="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition flex items-center gap-1" @click.stop="generateInvoice(o)"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1.017.293l5.414 5.414a1 1.017.293.707V19a2 2 0 01-2 2z"></path></svg>Invoice</button></div></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="border-t border-slate-100 p-4 bg-slate-50 flex items-center justify-between font-bold text-xs"><span class="text-slate-500 font-bold">Showing page {{ page }} of {{ totalPages }}</span><div class="flex gap-2"><button :disabled="page === 1" @click="page--" class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 disabled:opacity-50 transition">Previous</button><button :disabled="page === totalPages" @click="page++" class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 disabled:opacity-50 transition">Next</button></div></div>
        </section>
      </div>

      <OrderDetailsModal v-if="showDetails && selected" :order="selected" :formatMoney="formatMoney" :formatDate="formatDate" :initials="initials" :statusPill="statusPill" @close="closeDetails" @generate-invoice="generateInvoice" @update-status="updateStatus" @mark-paid="triggerMarkPaid" @refund="handleRefund" />

      <ConfirmModal :is-open="showMarkPaidConfirm" title="Mark as Paid?" confirm-text="Mark Paid" cancel-text="Cancel" type="success" @close="showMarkPaidConfirm = false" @confirm="confirmMarkPaid" ><template #message><p class="text-slate-500 mb-6">Are you sure you want to mark this order as <strong>PAID</strong>?</p></template></ConfirmModal>
      <ConfirmModal :is-open="showCancelConfirm" title="Cancel Order?" confirm-text="Yes, Cancel" type="danger" @close="showCancelConfirm = false" @confirm="confirmCancelOrder"><template #message><p class="text-slate-500 mb-6">This action cannot be undone.</p></template></ConfirmModal>
      
      <transition name="fade"><div v-if="toast" class="fixed bottom-6 right-6 z-[100] bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-bold"><div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>{{ toast }}</div></transition>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import ConfirmModal from '../../components/Admin/ConfirmModal.vue';
import StatusBadge from '../../components/UI/StatusBadge.vue';
import OrderDetailsModal from '../../components/Admin/Orders/OrderDetailsModal.vue';
import { exportCSVService, downloadInvoiceService, generateFinancialReportService } from '../../services/orderExport';

const API_BASE = "https://petstore-backend-api.onrender.com/api";

export default defineComponent({
  name: "Orders",
  components: { ConfirmModal, StatusBadge, OrderDetailsModal },
  props: ['globalSearch'],
  data() {
    return {
      orders: [] as any[], isLoading: false, toast: "", q: "", activeStatus: "all", page: 1, pageSize: 8, showDetails: false, selected: null as any,
      showCancelConfirm: false, pendingCancelOrder: null as any, showMarkPaidConfirm: false, pendingPaidOrder: null as any,
      activePaymentFilter: 'all', showExportMenu: false, showReportMenu: false, exportOptions: ['All Time', 'Today', 'This Week', 'This Month', 'This Year'],
    };
  },
  setup() {
    const route = useRoute(); const authStore = useAuthStore();
    return { route, authStore };
  },
  computed: {
    statusTabs() { return [{ key: "all", label: "All", count: this.orders.length }, { key: "Pending", label: "Pending", count: this.orders.filter(o => o.status === 'Pending').length }, { key: "Processing", label: "Processing", count: this.orders.filter(o => o.status === 'Processing').length }, { key: "Shipped", label: "Shipped", count: this.orders.filter(o => o.status === 'Shipped').length }, { key: "Delivered", label: "Delivered", count: this.orders.filter(o => o.status === 'Delivered').length }, { key: "Cancelled", label: "Cancelled", count: this.orders.filter(o => o.status === 'Cancelled').length }]; },
    filteredSorted() { let list = this.orders; if (this.activeStatus !== "all") list = list.filter(o => o.status === this.activeStatus); if (this.activePaymentFilter === 'paid') list = list.filter(o => o.isPaid); if (this.activePaymentFilter === 'unpaid') list = list.filter(o => !o.isPaid); const search = this.q.toLowerCase().trim(); if (search) list = list.filter(o => o.id.toLowerCase().includes(search) || o.customer.toLowerCase().includes(search)); return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); },
    totalPages() { return Math.max(1, Math.ceil(this.filteredSorted.length / this.pageSize)); },
    paged() { return this.filteredSorted.slice((this.page - 1) * this.pageSize, this.page * this.pageSize); },
    stats() { const paidStatuses = ['Paid', 'Processing', 'Shipped', 'Delivered']; return { total: this.orders.length, revenue: this.orders.filter(o => paidStatuses.includes(o.status)).reduce((s, o) => s + (o.total || 0), 0), paidCount: this.orders.filter(o => o.isPaid).length, unpaidCount: this.orders.filter(o => !o.isPaid).length, pending: this.orders.filter(o => o.status === 'Pending').length, delivered: this.orders.filter(o => o.status === 'Delivered').length }; }
  },
  methods: {
    getAuthHeader() { const token = this.authStore.token || JSON.parse(localStorage.getItem('userInfo') || '{}').token; return { headers: { Authorization: `Bearer ${token}` } }; },
    formatMoney(amt: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt || 0); },
    formatDate(date: string) { return date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'; },
    initials(name: string) { return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??'; },
    statusPill(status: string) { const map: any = { Paid: "bg-emerald-50 text-emerald-700 border-emerald-100", Pending: "bg-amber-50 text-amber-700 border-amber-100", Shipped: "bg-blue-50 text-blue-700 border-blue-100", Delivered: "bg-emerald-100 text-emerald-800 border-emerald-200", Cancelled: "bg-rose-50 text-rose-700 border-rose-100", Processing: "bg-indigo-50 text-indigo-700 border-indigo-100" }; return map[status] || "bg-slate-50"; },
    showToast(msg: string) { this.toast = msg; setTimeout(() => { this.toast = ""; }, 3000); },
    openDetails(order: any) { this.selected = { ...order }; this.showDetails = true; },
    closeDetails() { this.showDetails = false; this.selected = null; },
    async fetchOrders() { this.isLoading = true; try { const { data } = await axios.get(`${API_BASE}/orders`, this.getAuthHeader()); this.orders = data.map((o: any) => ({ id: o._id, customer: o.user ? `${o.user.firstName} ${o.user.lastName}` : 'Guest', email: o.user ? o.user.email : 'N/A', date: o.createdAt, total: o.totalPrice, status: o.status || 'Pending', orderItems: o.orderItems || [], isPaid: o.isPaid || false, paidAt: o.paidAt, paymentMethod: o.paymentMethod || 'N/A', shippingAddress: o.shippingAddress })); } finally { this.isLoading = false; } },
    async updateStatus(o: any, e: any) { const s = e.target ? e.target.value : e; try { await axios.put(`${API_BASE}/orders/${o.id}/status`, { status: s }, this.getAuthHeader()); o.status = s; this.showToast(`Updated to ${s}`); } catch { this.showToast("Failed"); } },
    async confirmCancelOrder() { if (!this.pendingCancelOrder) return; try { await axios.put(`${API_BASE}/orders/${this.pendingCancelOrder.id}/status`, { status: 'Cancelled' }, this.getAuthHeader()); this.pendingCancelOrder.status = 'Cancelled'; this.showToast("Cancelled"); } finally { this.showCancelConfirm = false; } },
    triggerMarkPaid(order: any) { this.pendingPaidOrder = order; this.showMarkPaidConfirm = true; },
    async confirmMarkPaid() { if (!this.pendingPaidOrder) return; try { await axios.put(`${API_BASE}/orders/${this.pendingPaidOrder.id}/pay`, {}, this.getAuthHeader()); this.pendingPaidOrder.isPaid = true; this.showToast("Paid"); } finally { this.showMarkPaidConfirm = false; } },
    async handleRefund(order: any) { if (!confirm("Refund?")) return; try { await axios.put(`${API_BASE}/orders/${order.id}/status`, { status: 'Cancelled' }, this.getAuthHeader()); order.status = 'Cancelled'; this.showToast("Refunded"); this.closeDetails(); } catch { this.showToast("Failed"); } },
    filterOrdersByRange(range: string) { const now = new Date(); return this.orders.filter(o => { const d = new Date(o.date); if (range === 'Today') return d.toDateString() === now.toDateString(); if (range === 'This Month') return d.getMonth() === now.getMonth(); return true; }); },
    exportCSV(range: string) { exportCSVService(this.filterOrdersByRange(range), range, this.formatDate); this.showToast("CSV Exported"); },
    async generateInvoice(order: any) { this.showToast("Preparing..."); const { data } = await axios.get(`${API_BASE}/orders/${order.id}`, this.getAuthHeader()); downloadInvoiceService(data, this.formatMoney, this.formatDate); },
    generateFinancialReport(range: string) { generateFinancialReportService(this.filterOrdersByRange(range), range, this.formatMoney); this.showToast("PDF Exported"); }
  },
  mounted() { this.fetchOrders(); }
});
</script>