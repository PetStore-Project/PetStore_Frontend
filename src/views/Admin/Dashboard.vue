<template>
  <div class="w-full min-h-screen bg-[#F8FAFC]">
    <main class="flex-1 w-full overflow-y-auto px-4 sm:px-8 pt-8 pb-10">

      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{{ currentDate }}</p>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Performance Overview</h1>
        </div>
        <div class="flex gap-3">
          <button @click="generateReport" class="flex items-center gap-2 px-5 py-2.5 bg-slate-900 border border-slate-900 rounded-xl text-xs font-bold text-white hover:bg-slate-800 transition shadow-lg shadow-slate-200">
             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
             Export Report
          </button>
          <button @click="loadData" class="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm">
            <span v-if="isLoading" class="animate-spin h-3 w-3 border-2 border-slate-400 border-t-transparent rounded-full"></span>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            {{ isLoading ? 'Loading...' : 'Refresh Data' }}
          </button>
        </div>
      </div>

      <AdminStatsGrid>
        <StatsCard label="Total Revenue" :value="formatMoney(stats.revenue)" color="emerald">
          <template #icon>
            <svg class="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05 1.18 1.91 2.53 1.91 1.29 0 2.13-.81 2.13-1.88 0-1.1-.68-1.57-1.75-1.82l-2.02-.46c-1.75-.41-3.04-1.5-3.04-3.56 0-1.77 1.29-3.06 3.2-3.4V3h2.67v1.93c1.38.3 2.48 1.34 2.63 3.03h-1.97c-.09-.86-.82-1.54-1.92-1.54-1.21 0-1.87.82-1.87 1.63 0 1.05.79 1.57 2.02 1.83l1.8.41c1.92.46 3.1 1.58 3.1 3.73 0 1.78-1.18 3.27-3.16 3.69z"></path></svg>
          </template>
          <template #subtext>
            <span class="text-xs font-bold px-2 py-1 rounded-lg" :class="stats.trend >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'">
              {{ stats.trend >= 0 ? '+' : '' }}{{ stats.trend }}%
            </span>
            <span class="text-xs text-slate-400 font-medium">vs last month</span>
          </template>
        </StatsCard>

        <StatsCard label="Total Orders" :value="stats.orders" color="blue">
          <template #icon>
            <svg class="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path></svg>
          </template>
          <template #subtext>
             <span class="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-lg">{{ stats.pendingOrders }} Pending</span>
          </template>
        </StatsCard>

        <StatsCard
          label="Inventory"
          :value="stats.products"
          color="purple"
          class="cursor-pointer hover:border-purple-200 transition"
          @click="$router.push('/admin/products?filter=low_stock')"
        >
          <template #icon>
            <svg class="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l-5.5 9h11z"/><path d="M10 22h4v-5.5h-4z"/></svg>
          </template>
          <template #subtext>
            <span class="text-xs font-bold px-2 py-1 rounded-lg" :class="stats.lowStock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'">
              {{ stats.lowStock > 0 ? `${stats.lowStock} Low Stock` : 'Stock Healthy' }}
            </span>
          </template>
        </StatsCard>

        <StatsCard label="Customers" :value="stats.customers" color="amber">
          <template #icon>
            <svg class="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
          </template>
          <template #subtext>
            <span v-if="stats.newCustomers > 0" class="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-lg">+{{ stats.newCustomers }} New</span>
            <span v-else class="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-lg">No new users</span>
            <span class="text-xs text-slate-400 font-medium">Today</span>
          </template>
        </StatsCard>
      </AdminStatsGrid>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

        <RevenueChart
          v-model:mode="chartMode"
          :current-mode="chartMode"
          :data-points="currentRevenueSeries"
          :labels="chartLabels"
        />

        <OrderStatusChart :stats="stats" />

      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <TopProducts
          v-model="topProductsFilter"
          :products="topProducts"
        />

        <RecentTransactions :orders="recentOrders" />

      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div class="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-[32px] p-8 text-white shadow-lg">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-black">Promotion Summary</h3>
            <router-link to="/admin/promotions" class="text-xs font-bold bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition">Manage</router-link>
          </div>
          <div class="grid grid-cols-2 gap-6">
            <div>
              <p class="text-emerald-100 text-xs font-bold uppercase mb-1">Active Campaigns</p>
              <p class="text-3xl font-black">{{ promoStats.active }}</p>
            </div>
            <div>
              <p class="text-emerald-100 text-xs font-bold uppercase mb-1">Total Redemptions</p>
              <p class="text-3xl font-black">{{ promoStats.totalRedemptions }}</p>
            </div>
            <div class="pt-4 border-t border-white/20">
              <p class="text-emerald-100 text-xs font-bold uppercase mb-1">Impact Sales</p>
              <p class="text-2xl font-black">{{ formatMoney(promoStats.revenue || 0) }}</p>
            </div>
             <div class="pt-4 border-t border-white/20">
              <p class="text-emerald-100 text-xs font-bold uppercase mb-1">Est. Savings Given</p>
              <p class="text-2xl font-black">{{ formatMoney(promoStats.estimatedSavings) }}</p>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-black text-slate-900">Top Performing Promos</h3>
            <button @click="showAllPromosModal = true" class="text-xs font-bold text-blue-600 hover:underline">View All</button>
          </div>
          <div class="space-y-4 flex-1 overflow-x-auto">
            <div class="min-w-[400px] flex flex-col gap-4">
              <div v-for="(promo, i) in topPromos" :key="i" class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm"
                    :class="promo.type === 'percent' ? 'bg-purple-500' : 'bg-emerald-500'">
                    {{ promo.type === 'percent' ? '%' : '$' }}
                  </div>
                  <div>
                    <p class="font-mono font-black text-slate-900">{{ promo.code }}</p>
                    <p class="text-xs text-slate-500">{{ promo.type === 'percent' ? promo.value + '% Off' : '$' + promo.value + ' Off' }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-black text-slate-900">{{ promo.usageCount || 0 }}</p>
                  <p class="text-xs text-slate-500">redemptions</p>
                  <p class="text-[10px] font-bold text-emerald-600 mt-1">{{ formatMoney(promo.revenue || 0) }}</p>
                </div>
              </div>
            </div>
            <div v-if="topPromos.length === 0" class="flex flex-col items-center justify-center py-8 text-center">
              <div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-300">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
              </div>
              <p class="text-slate-400 text-sm font-medium">No redemptions yet</p>
              <p class="text-slate-300 text-xs mt-1">Promo usage will appear here</p>
            </div>
          </div>
        </div>
      </div>

    </main>


    <div v-if="showAllPromosModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showAllPromosModal = false"></div>
      <div class="relative bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <h3 class="text-xl font-black text-slate-900">All Performing Promotions</h3>
          <button @click="showAllPromosModal = false" class="p-2 hover:bg-slate-100 rounded-full transition">
            <svg class="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div class="overflow-y-auto p-6 space-y-4">
           <div v-for="(promo, i) in allPerformingPromos" :key="i" class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm"
                :class="promo.type === 'percent' ? 'bg-purple-500' : 'bg-emerald-500'">
                {{ promo.type === 'percent' ? '%' : '$' }}
              </div>
              <div>
                <p class="font-mono font-black text-slate-900">{{ promo.code }}</p>
                <p class="text-xs text-slate-500">{{ promo.type === 'percent' ? promo.value + '% Off' : '$' + promo.value + ' Off' }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-black text-slate-900">{{ promo.usageCount || 0 }}</p>
              <p class="text-xs text-slate-500">redemptions</p>
              <p class="text-[10px] font-bold text-emerald-600 mt-1">{{ formatMoney(promo.revenue || 0) }}</p>
            </div>
          </div>
          <div v-if="allPerformingPromos.length === 0" class="text-center py-8 text-slate-400 font-medium">
             No performing promotions found yet.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useOrderStore } from '@/stores/order';
import { useProductStore } from '@/stores/product';
import { useCustomerStore } from '@/stores/customer';
import { usePromotionStore } from '@/stores/promotion';

import { generateDashboardReportService } from '@/services/dashboardExport';

// New Components
import AdminStatsGrid from '@/components/Admin/Shared/AdminStatsGrid.vue';
import StatsCard from '@/components/Admin/StatsCard.vue';
import RevenueChart from '@/components/Admin/Dashboard/RevenueChart.vue';
import OrderStatusChart from '@/components/Admin/Dashboard/OrderStatusChart.vue';
import TopProducts from '@/components/Admin/Dashboard/TopProducts.vue';
import RecentTransactions from '@/components/Admin/Dashboard/RecentTransactions.vue';

export default defineComponent({
  name: "Dashboard",
  components: {
    AdminStatsGrid,
    StatsCard,
    RevenueChart,
    OrderStatusChart,
    TopProducts,
    RecentTransactions
  },
  setup() {
    const authStore = useAuthStore();
    const orderStore = useOrderStore();
    const productStore = useProductStore();
    const customerStore = useCustomerStore();
    const promotionStore = usePromotionStore();

    const isLoading = ref(true);
    const chartMode = ref<'daily' | 'monthly' | 'yearly'>('monthly');

    // Dashboard Stats State
    const stats = ref({
      revenue: 0,
      orders: 0,
      products: 0,
      customers: 0,
      newCustomers: 0,
      lowStock: 0,
      pendingOrders: 0,
      completedPercent: 0,
      processPercent: 0,
      pendingPercent: 0,
      trend: 0,
      processingOrders: 0
    });

    const topProductsFilter = ref('All Time');

    // Top Promos State
    const showAllPromosModal = ref(false);
    const allPerformingPromos = ref<any[]>([]);

    // Top Products Logic
    const topProducts = computed(() => {
      const now = new Date();
      // Use orderStore.orders directly
      let filtered = orderStore.orders;

      if (topProductsFilter.value !== 'All Time') {
        filtered = filtered.filter((o: any) => {
          const d = new Date(o.createdAt);
          switch (topProductsFilter.value) {
            case 'Today': return d.toDateString() === now.toDateString();
            case 'This Week': {
               const weekStart = new Date(now);
               weekStart.setDate(now.getDate() - now.getDay());
               weekStart.setHours(0,0,0,0);
               return d >= weekStart;
            }
            case 'This Month': return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            case 'This Year': return d.getFullYear() === now.getFullYear();
            default: return true;
          }
        });
      }

      const itemMap: Record<string, number> = {};

      filtered.forEach((o: any) => {
        if (o.isPaid) {
           if (o.orderItems && Array.isArray(o.orderItems)) {
              o.orderItems.forEach((item: any) => {
                const qty = item.quantity || item.qty || 0;
                itemMap[item.name] = (itemMap[item.name] || 0) + qty;
              });
           }
        }
      });

      const sorted = Object.entries(itemMap)
        .map(([name, qty]) => ({ name, qty }))
        .filter(i => i.qty > 0)
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 5);

      const max = sorted.length > 0 && sorted[0]? sorted[0].qty : 1;

      return sorted.map(i => ({
        ...i,
        percent: Math.round((i.qty / max) * 100)
      }));
    });

    const recentOrders = computed(() => orderStore.orders.slice(0, 5));

    // Top Promos Logic
    const topPromos = computed(() => {
        const performantPromos = promotionStore.promotions
          .filter((p: any) => (p.usageCount || 0) > 0)
          .sort((a: any, b: any) => (b.revenue || 0) - (a.revenue || 0));
        return performantPromos.slice(0, 5);
    });

    // We need to sync allPerformingPromos somehow or just use computed
    // Originally it was set in loadData. Let's make it computed.
    const allPerformingPromosComputed = computed(() => {
        return promotionStore.promotions
          .filter((p: any) => (p.usageCount || 0) > 0)
          .sort((a: any, b: any) => (b.revenue || 0) - (a.revenue || 0));
    });

    interface PromoStats {
      active: number;
      totalRedemptions: number;
      estimatedSavings: number;
      revenue: number;
    }

    const promoStats = computed<PromoStats>(() => {
        const now = new Date();
        const activePromos = promotionStore.promotions.filter((p: any) =>
          new Date(p.startDate) <= now && new Date(p.endDate) >= now
        );

        const ordersWithDiscount = orderStore.orders.filter((o: any) =>
          (o.discountAmount && o.discountAmount > 0) || o.promoCode
        );

        const apiRedemptions = promotionStore.promotions.reduce((sum: number, p: any) => sum + (p.usageCount || 0), 0);
        const totalRedemptions = Math.max(ordersWithDiscount.length, apiRedemptions);

        return {
          active: activePromos.length,
          totalRedemptions: totalRedemptions,
          estimatedSavings: promotionStore.promotions.reduce((sum: number, p: any) => sum + (p.totalSavings || 0), 0),
          revenue: promotionStore.promotions.reduce((sum: number, p: any) => sum + (p.revenue || 0), 0)
        };
    });

    // Revenue New Chart Logic
    const revenueSeries = ref(new Array(12).fill(0));
    const dailyRevenue = ref(new Array(7).fill(0));
    const yearlyRevenue = ref(new Array(5).fill(0));

    // Chart helpers
    const currentRevenueSeries = computed(() => {
      if (chartMode.value === 'daily') return dailyRevenue.value;
      if (chartMode.value === 'yearly') return yearlyRevenue.value;
      return revenueSeries.value;
    });

    const chartLabels = computed(() => {
      if (chartMode.value === 'daily') {
        const labels = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
        }
        return labels;
      }
      if (chartMode.value === 'yearly') {
        const labels = [];
        const cur = new Date().getFullYear();
        for (let i = 4; i >= 0; i--) labels.push((cur - i).toString());
        return labels;
      }
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    });

    const chartMaxValue = computed(() => {
      const max = Math.max(...currentRevenueSeries.value);
      return Math.ceil(max / 100) * 100 || 100;
    });

    const currentDate = computed(() => {
      return new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    });

    // Formatters
    const formatMoney = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

    // Calc Revenue Data from Store
    const calculateRevenueData = () => {
         const orders = orderStore.orders;
         const currentYear = new Date().getFullYear();

         // Monthly
         const monthlyRev = new Array(12).fill(0);
         orders.forEach((o: any) => {
           const d = new Date(o.createdAt);
           if (d.getFullYear() === currentYear && o.isPaid) {
             monthlyRev[d.getMonth()] += (o.totalPrice || 0);
           }
         });
         revenueSeries.value = monthlyRev;

         // Daily
         const today = new Date();
         const dailyRev = new Array(7).fill(0);
         for (let i = 0; i < 7; i++) {
           const targetDate = new Date(today);
           targetDate.setDate(today.getDate() - (6 - i));
           const dateStr = targetDate.toDateString();
           orders.forEach((o: any) => {
             if (new Date(o.createdAt).toDateString() === dateStr && o.isPaid) {
               dailyRev[i] += (o.totalPrice || 0);
             }
           });
         }
         dailyRevenue.value = dailyRev;

         // Yearly
         const yearlyRev = new Array(5).fill(0);
         for (let i = 0; i < 5; i++) {
           const year = currentYear - (4 - i);
           orders.forEach((o: any) => {
             const orderDate = new Date(o.createdAt);
             if (orderDate.getFullYear() === year && o.isPaid) {
               yearlyRev[i] += (o.totalPrice || 0);
             }
           });
         }
         yearlyRevenue.value = yearlyRev;
    };

    // Calculate Main Stats
    const calculateMainStats = () => {
        const orders = orderStore.orders;
        const products = productStore.products;
        const users = customerStore.customers;

        const completedStatuses = ['Delivered', 'Shipped', 'Refunded'];
        const processStatuses = ['Paid', 'Processing'];
        const pendingStatuses = ['Pending'];

        const completedCount = orders.filter((o: any) => completedStatuses.includes(o.status)).length;
        const processCount = orders.filter((o: any) => processStatuses.includes(o.status)).length;
        const pendingCount = orders.filter((o: any) => pendingStatuses.includes(o.status)).length;

        const totalBase = orders.length || 1;
        const totalRev = orders.filter((o: any) => o.isPaid).reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0);

        const trendNow = new Date();
        const thisMonth = trendNow.getMonth();
        const thisYear = trendNow.getFullYear();
        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
        const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

        const thisMonthRev = orders.filter((o: any) => {
          const d = new Date(o.createdAt);
          return d.getMonth() === thisMonth && d.getFullYear() === thisYear && o.isPaid;
        }).reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0);

        const lastMonthRev = orders.filter((o: any) => {
          const d = new Date(o.createdAt);
          return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear && o.isPaid;
        }).reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0);

        const prevRev = lastMonthRev || 1;
        const trend = ((thisMonthRev - prevRev) / prevRev) * 100;

        stats.value = {
          revenue: totalRev,
          orders: orders.length,
          products: products.length,
          customers: users.length,
          newCustomers: users.filter((u: any) => new Date(u.createdAt).toDateString() === new Date().toDateString()).length,
          lowStock: products.filter((p: any) => (p.stockQuantity || p.stock || 0) <= 5).length,
          processingOrders: processCount,
          pendingOrders: pendingCount,

          completedPercent: Math.round((completedCount / totalBase) * 100),
          processPercent: Math.round((processCount / totalBase) * 100),
          pendingPercent: Math.round((pendingCount / totalBase) * 100),

          trend: Math.round(trend * 10) / 10
        };
    };

    // API Data Fetch
    const loadData = async () => {
      isLoading.value = true;
      try {
        await Promise.all([
           orderStore.fetchOrders(),
           productStore.fetchProducts(),
           customerStore.fetchCustomers(),
           promotionStore.fetchPromotions()
        ]);

        calculateRevenueData();
        calculateMainStats();

      } catch (error) {
        console.error("Dashboard Load Error:", error);
      } finally {
        isLoading.value = false;
      }
    };

    // Export Report
    const generateReport = () => {
      generateDashboardReportService(
        stats.value,
        topProducts.value,
        topProductsFilter.value,
        promoStats.value,
        formatMoney
      );
    };

    onMounted(loadData);

    return {
      isLoading, currentDate, stats, loadData, formatMoney,
      chartMode, currentRevenueSeries, chartLabels, chartMaxValue,
      topProductsFilter, topProducts,
      recentOrders,
      promoStats, topPromos, allPerformingPromos: allPerformingPromosComputed, showAllPromosModal,
      generateReport
    };
  }
});
</script>
