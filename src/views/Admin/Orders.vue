<template>
  <div class="w-full min-h-screen bg-slate-50 flex flex-col font-sans">
    <main class="flex-1 w-full overflow-y-auto px-4 sm:px-8 pt-8 pb-10">

      <!-- Page Header -->
      <AdminPageHeader 
        title="Orders Center" 
        description="Track revenue and manage order fulfillment in real-time."
      >
        <template #actions>
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
        </template>
      </AdminPageHeader>

      <!-- Stats Grid -->
      <AdminStatsGrid>
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
      </AdminStatsGrid>

      <!-- Filter Section (Custom for Orders due to Tabs) -->
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
                <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
            </div>
          </div>
        </section>

        <!-- Orders Table & Pagination -->
        <OrdersTable 
          :orders="paged" 
          :is-loading="isLoading"
          @view-details="openDetails"
          @update-status="updateStatus"
          @generate-invoice="generateInvoice"
        >
          <template #pagination>
             <AdminPagination 
                v-if="!isLoading && orders.length > 0"
                v-model:currentPage="page"
                :totalPages="totalPages"
             />
          </template>
        </OrdersTable>
      </div>

      <!-- Modals -->
      <OrderDetailsModal 
        v-if="showDetails && selected" 
        :order="selected" 
        :formatMoney="formatMoney" 
        :formatDate="formatDate" 
        :initials="initials" 
        :statusPill="statusPill" 
        @close="closeDetails" 
        @generate-invoice="generateInvoice" 
        @update-status="updateStatus" 
        @mark-paid="triggerMarkPaid" 
        @refund="handleRefund" 
      />

      <ConfirmModal :is-open="showMarkPaidConfirm" title="Mark as Paid?" confirm-text="Mark Paid" cancel-text="Cancel" type="success" @close="showMarkPaidConfirm = false" @confirm="confirmMarkPaid" ><template #message><p class="text-slate-500 mb-6">Are you sure you want to mark this order as <strong>PAID</strong>?</p></template></ConfirmModal>
      <ConfirmModal :is-open="showCancelConfirm" title="Cancel Order?" confirm-text="Yes, Cancel" type="danger" @close="showCancelConfirm = false" @confirm="confirmCancelOrder"><template #message><p class="text-slate-500 mb-6">This action cannot be undone.</p></template></ConfirmModal>
      
      <!-- Update Status Confirmation Modal -->
      <ConfirmModal
        :is-open="showStatusUpdateConfirm"
        :title="`Update Order Status?`"
        :confirm-text="`Update to ${pendingStatusUpdate?.newStatus}`"
        cancel-text="No, Cancel"
        type="danger"
        @close="cancelStatusUpdateConfirm"
        @confirm="confirmStatusUpdate"
      >
        <template #icon>
          <div :class="['w-12 h-12 rounded-full flex items-center justify-center', 
             pendingStatusUpdate?.newStatus === 'Cancelled' ? 'bg-rose-100 text-rose-600' : 
             pendingStatusUpdate?.newStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600']">
            <svg v-if="pendingStatusUpdate?.newStatus === 'Delivered'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            <svg v-else-if="pendingStatusUpdate?.newStatus === 'Cancelled'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </template>
        <template #message>
           <div class="text-slate-500 mb-6 space-y-3">
            <p>Are you sure you want to change order <span class="font-mono font-bold">#{{ pendingStatusUpdate?.order?.id?.slice(-6).toUpperCase() }}</span> status to <span class="font-bold text-slate-900">{{ pendingStatusUpdate?.newStatus }}</span>?</p>
            
            <div v-if="pendingStatusUpdate?.newStatus === 'Delivered'" class="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-700">
              <p class="font-bold mb-1 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                Irreversible Action
              </p>
              <p class="font-medium mb-1">This will permanently mark the order as <span class="font-black underline">Delivered</span>.</p>
            </div>

            <div v-if="pendingStatusUpdate?.newStatus === 'Cancelled'" class="p-3 bg-rose-50 rounded-xl border border-rose-100 text-xs text-rose-700">
              <p class="font-bold mb-1 uppercase tracking-wider text-[10px]">Critical Action</p>
              <p class="font-medium mb-1">Changing status to <span class="font-black underline">Cancelled</span> is irreversible.</p>
            </div>
          </div>
        </template>
      </ConfirmModal>

      <transition name="fade"><div v-if="toast" class="fixed bottom-6 right-6 z-[100] bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-bold"><div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>{{ toast }}</div></transition>

    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

// Components
import AdminPageHeader from '../../components/Admin/Shared/AdminPageHeader.vue';
import AdminStatsGrid from '../../components/Admin/Shared/AdminStatsGrid.vue';
import AdminPagination from '../../components/Admin/Shared/AdminPagination.vue';
import OrdersTable from '../../components/Admin/Orders/OrdersTable.vue';
import ConfirmModal from '../../components/Admin/ConfirmModal.vue';
import OrderDetailsModal from '../../components/Admin/Orders/OrderDetailsModal.vue';

import { exportCSVService, downloadInvoiceService, generateFinancialReportService } from '../../services/orderExport';

const API_BASE = "https://petstore-backend-api.onrender.com/api";

export default defineComponent({
  name: "Orders",
  components: { 
    AdminPageHeader,
    AdminStatsGrid,
    AdminPagination,
    OrdersTable,
    ConfirmModal, 
    OrderDetailsModal 
  },
  props: ['globalSearch'],
  data() {
    return {
      orders: [] as any[], isLoading: false, toast: "", q: "", activeStatus: "all", page: 1, pageSize: 8, showDetails: false, selected: null as any,
      showCancelConfirm: false, pendingCancelOrder: null as any, showMarkPaidConfirm: false, pendingPaidOrder: null as any,
      activePaymentFilter: 'all', showExportMenu: false, showReportMenu: false, exportOptions: ['All Time', 'Today', 'This Week', 'This Month', 'This Year'],
      showStatusUpdateConfirm: false, pendingStatusUpdate: null as any,
    };
  },
  setup() {
    const route = useRoute();
    const authStore = useAuthStore();
    return { route, authStore };
  },
  computed: {
    // --- STATUS TABS ---
    statusTabs() { return [{ key: "all", label: "All", count: this.orders.length }, { key: "Pending", label: "Pending", count: this.orders.filter(o => o.status === 'Pending').length }, { key: "Processing", label: "Processing", count: this.orders.filter(o => o.status === 'Processing').length }, { key: "Shipped", label: "Shipped", count: this.orders.filter(o => o.status === 'Shipped').length }, { key: "Delivered", label: "Delivered", count: this.orders.filter(o => o.status === 'Delivered').length }, { key: "Cancelled", label: "Cancelled", count: this.orders.filter(o => o.status === 'Cancelled').length }]; },
    
    // --- FILTER LOGIC ---
    filteredSorted() { let list = this.orders; if (this.activeStatus !== "all") list = list.filter(o => o.status === this.activeStatus); if (this.activePaymentFilter === 'paid') list = list.filter(o => o.isPaid); if (this.activePaymentFilter === 'unpaid') list = list.filter(o => !o.isPaid); const search = this.q.toLowerCase().trim(); if (search) list = list.filter(o => o.id.toLowerCase().includes(search) || o.customer.toLowerCase().includes(search)); return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); },
    
    // --- STATS CALCULATION ---
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
    
    // --- MODAL CONTROLS ---
    openDetails(order: any) { this.selected = { ...order }; this.showDetails = true; },
    closeDetails() { this.showDetails = false; this.selected = null; },
    
    // --- API CALLS ---
    async fetchOrders() { this.isLoading = true; try { const { data } = await axios.get(`${API_BASE}/orders`, this.getAuthHeader()); this.orders = data.map((o: any) => ({ id: o._id, customer: o.user ? `${o.user.firstName} ${o.user.lastName}` : 'Guest', email: o.user ? o.user.email : 'N/A', date: o.createdAt, total: o.totalPrice, status: o.status || 'Pending', orderItems: o.orderItems || [], isPaid: o.isPaid || false, paidAt: o.paidAt, paymentMethod: o.paymentMethod || 'N/A', shippingAddress: o.shippingAddress })); } finally { this.isLoading = false; } },
    async updateStatus(o: any, e: any) {
      const s = e.target ? e.target.value : e;
      if (o.status === 'Cancelled') { this.showToast("Cannot modify a cancelled order."); return; }
      this.pendingStatusUpdate = { order: o, newStatus: s, event: e };
      this.showStatusUpdateConfirm = true;
      if (e.target) e.target.value = o.status;
    },
    cancelStatusUpdateConfirm() { this.showStatusUpdateConfirm = false; this.pendingStatusUpdate = null; },
    async confirmStatusUpdate() { 
      if (!this.pendingStatusUpdate) return; 
      const { order, newStatus } = this.pendingStatusUpdate; 
      try { 
        await axios.put(`${API_BASE}/orders/${order.id}/status`, { status: newStatus }, this.getAuthHeader()); 
        
        // Update local state by finding the exact index for reactivity
        const index = this.orders.findIndex(x => x.id === order.id);
        if (index !== -1) {
          this.orders[index].status = newStatus;
        }
        
        this.showToast(`Updated to ${newStatus}`); 
      } catch { 
        this.showToast("Failed"); 
      } finally { 
        this.cancelStatusUpdateConfirm(); 
      } 
    },
    async confirmCancelOrder() { if (!this.pendingCancelOrder) return; try { await axios.put(`${API_BASE}/orders/${this.pendingCancelOrder.id}/status`, { status: 'Cancelled' }, this.getAuthHeader()); this.pendingCancelOrder.status = 'Cancelled'; const orig = this.orders.find(x => x.id === this.pendingCancelOrder.id); if (orig) orig.status = 'Cancelled'; this.showToast("Cancelled"); } finally { this.showCancelConfirm = false; } },
    triggerMarkPaid(order: any) { this.pendingPaidOrder = order; this.showMarkPaidConfirm = true; },
    async confirmMarkPaid() { if (!this.pendingPaidOrder) return; try { await axios.put(`${API_BASE}/orders/${this.pendingPaidOrder.id}/pay`, {}, this.getAuthHeader()); this.pendingPaidOrder.isPaid = true; const orig = this.orders.find(x => x.id === this.pendingPaidOrder.id); if (orig) orig.isPaid = true; this.showToast("Paid"); } catch (err) { console.error(err); this.showToast("Failed to mark paid"); } finally { this.showMarkPaidConfirm = false; } },
    async handleRefund(order: any) { if (!confirm("Refund?")) return; try { await axios.put(`${API_BASE}/orders/${order.id}/status`, { status: 'Cancelled' }, this.getAuthHeader()); order.status = 'Cancelled'; const orig = this.orders.find(x => x.id === order.id); if (orig) orig.status = 'Cancelled'; this.showToast("Refunded"); this.closeDetails(); } catch { this.showToast("Failed"); } },
    filterOrdersByRange(range: string) { const now = new Date(); return this.orders.filter(o => { const d = new Date(o.date); if (range === 'Today') return d.toDateString() === now.toDateString(); if (range === 'This Month') return d.getMonth() === now.getMonth(); return true; }); },
    exportCSV(range: string) { exportCSVService(this.filterOrdersByRange(range), range, this.formatDate); this.showToast("CSV Exported"); },
    async generateInvoice(order: any) { this.showToast("Preparing..."); const { data } = await axios.get(`${API_BASE}/orders/${order.id}`, this.getAuthHeader()); downloadInvoiceService(data, this.formatMoney, this.formatDate); },
    generateFinancialReport(range: string) { generateFinancialReportService(this.filterOrdersByRange(range), range, this.formatMoney); this.showToast("PDF Exported"); }
  },
  mounted() { this.fetchOrders(); }
});
</script>