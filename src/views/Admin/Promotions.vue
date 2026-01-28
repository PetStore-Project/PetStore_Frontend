<template>
  <div class="w-full min-h-screen">
    
    <!-- Header -->
    <AdminPageHeader title="Campaigns" description="Create discount codes and manage offers.">
      <template #actions>
        <button @click="openModal" class="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition transform hover:-translate-y-0.5">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          New Campaign
        </button>
      </template>
    </AdminPageHeader>

    <!-- Stats Cards -->
    <AdminStatsGrid>
      <StatsCard label="Active" :value="activeCount" color="emerald">
        <template #icon>
          <svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </template>
      </StatsCard>

      <StatsCard label="Scheduled" :value="scheduledCount" color="blue">
        <template #icon>
          <svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </template>
      </StatsCard>
      
      <StatsCard label="Total Redemptions" :value="totalRedemptions" color="purple">
        <template #icon>
          <svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
        </template>
      </StatsCard>

      <StatsCard label="Est. Savings Given" :value="formatMoney(estimatedSavings)" color="amber">
        <template #icon>
          <svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </template>
      </StatsCard>
    </AdminStatsGrid>

    <!-- Content -->
    <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div v-for="n in 6" :key="n" class="h-48 bg-white rounded-3xl border border-slate-100 shadow-sm animate-pulse"></div>
    </div>

    <div v-else-if="promotions.length === 0" class="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[32px] border border-dashed border-slate-200">
      <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
      </div>
      <h3 class="text-lg font-black text-slate-900">No Active Campaigns</h3>
      <p class="text-slate-500 text-sm mt-1">Create a discount code to boost sales.</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
      <div
        v-for="promo in promotions"
        :key="promo._id"
        class="group relative bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col justify-between hover:shadow-xl hover:border-slate-200 transition-all duration-300"
      >
        <!-- Promo Card Content -->
        <div class="flex justify-between items-start mb-4">
          <div class="flex flex-col">
            <span class="text-[10px] font-black uppercase tracking-wider mb-1"
              :class="promo.campaignType === 'product_discount' ? 'text-purple-500' : 'text-emerald-500'">
              {{ promo.campaignType === 'product_discount' ? 'Product Discount' : 'Promo Code' }}
            </span>
            <div class="flex items-center gap-2">
              <span class="text-2xl font-black text-slate-900 tracking-tight font-mono bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 border-dashed">{{ promo.code }}</span>
              <button @click="copyCode(promo.code)" class="text-slate-400 hover:text-emerald-600 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              </button>
            </div>
          </div>

          <div class="flex flex-col items-end">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black shadow-lg"
              :class="promo.type === 'percent' ? 'bg-purple-500 shadow-purple-200' : 'bg-emerald-500 shadow-emerald-200'">
              {{ promo.type === 'percent' ? '%' : '$' }}
            </div>
          </div>
        </div>

        <div class="space-y-3 mb-4">
          <div class="flex justify-between items-center text-sm">
            <span class="text-slate-500 font-medium">Discount Value</span>
            <span class="font-bold text-slate-900">
              {{ promo.type === 'percent' ? promo.value + '% Off' : '$' + promo.value + ' Off' }}
            </span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-slate-500 font-medium">Redemptions</span>
            <span class="font-bold text-slate-900">{{ promo.usageCount || 0 }} / {{ promo.usageLimit || '∞' }}</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-slate-500 font-medium">Valid Period</span>
            <span class="font-bold text-slate-900 text-xs">{{ formatDate(promo.startDate) }} - {{ formatDate(promo.endDate) }}</span>
          </div>
          
          <div v-if="promo.applicableProducts && promo.applicableProducts.length > 0" class="flex justify-between items-center text-sm">
            <span class="text-slate-500 font-medium">Applies To</span>
            <span class="font-bold text-purple-600 text-xs">{{ promo.applicableProducts.length }} products</span>
          </div>
          <div v-else class="flex justify-between items-center text-sm">
            <span class="text-slate-500 font-medium">Applies To</span>
            <span class="font-bold text-emerald-600 text-xs">All Products</span>
          </div>
        </div>

        <div class="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100">
          <div class="flex justify-between items-center text-sm">
            <span class="text-slate-500 font-medium">Est. Savings Given</span>
            <span class="font-black text-emerald-600">{{ formatMoney(calculatePromoSavings(promo)) }}</span>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-50 flex items-center justify-between">
          <span class="px-3 py-1.5 rounded-xl text-[11px] font-bold border"
            :class="getStatusClass(promo)">
            {{ getStatusText(promo) }}
          </span>

          <div class="flex gap-2">
            <button
              @click="editPromo(promo)"
              class="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-xl transition"
            >
              Edit
            </button>
            <div class="flex gap-2">
              <button
                @click="confirmBroadcast(promo._id)"
                :disabled="sendingPromoId === promo._id"
                class="flex-1 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl transition flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="sendingPromoId === promo._id" class="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span v-if="sendingPromoId === promo._id">Sending...</span>
                <span v-else>Email Alert</span>
              </button>

              <button
                @click="deletePromo(promo._id)"
                class="text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-xl transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <PromotionFormModal
      :is-open="showModal"
      :is-editing="isEditing"
      :form="form"
      :products="products"
      @close="closeModal"
      @save="savePromotion"
    />

    <ConfirmModal
      :is-open="showDeleteConfirm"
      title="Delete Campaign?"
      confirm-text="Delete"
      cancel-text="Cancel"
      type="danger"
      @close="cancelDelete"
      @confirm="confirmDelete"
    >
      <template #message>
        <p class="text-slate-500 mb-6">Are you sure you want to delete this campaign? This action cannot be undone.</p>
      </template>
    </ConfirmModal>

    <ConfirmModal
      :is-open="showEmailConfirm"
      title="Send Email Alert?"
      confirm-text="Send Email"
      cancel-text="Cancel"
      type="info"
      @close="cancelBroadcast"
      @confirm="proceedBroadcast"
    >
      <template #icon>
        <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
      </template>
      <template #message>
        <p class="text-slate-500 mb-6">Are you sure you want to email this promotion to <strong>ALL users</strong>? This cannot be undone.</p>
      </template>
    </ConfirmModal>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';

// Components
import AdminPageHeader from '@/components/Admin/Shared/AdminPageHeader.vue';
import AdminStatsGrid from '@/components/Admin/Shared/AdminStatsGrid.vue';
import StatsCard from '@/components/Admin/StatsCard.vue';
import ConfirmModal from '@/components/Admin/ConfirmModal.vue';
import PromotionFormModal from '@/components/Admin/Promotions/PromotionFormModal.vue';

const API_BASE = "https://petstore-backend-api.onrender.com/api";

export default defineComponent({
  name: "Promotions",
  components: { 
    AdminPageHeader,
    AdminStatsGrid,
    StatsCard, 
    ConfirmModal,
    PromotionFormModal
  },
  setup() {
    const authStore = useAuthStore();
    const toast = useToast();
    const promotions = ref<any[]>([]);
    const products = ref<any[]>([]);
    const isLoading = ref(true);
    const showModal = ref(false);

    // --- FORM STATE ---
    const form = reactive({
      code: '',
      type: 'percent',
      value: 0,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: '',
      usageLimit: 0,
      applicableProducts: [] as string[],
      minPurchase: 0,
      campaignType: 'promo_code' as 'promo_code' | 'product_discount'
    });

    const isEditing = ref(false);
    const editingId = ref<string | null>(null);
    const sendingPromoId = ref<string | null>(null);

    const getAuthHeader = () => {
      let token = authStore.token;
      if (!token) {
         const stored = localStorage.getItem('userInfo');
         if (stored) token = JSON.parse(stored).token;
      }
      return { headers: { Authorization: `Bearer ${token}` } };
    };

    // --- API CALLS ---
    const fetchPromotions = async () => {
      isLoading.value = true;
      try {
        const { data } = await axios.get(`${API_BASE}/promotions`, getAuthHeader());
        promotions.value = data;
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    };

    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/products`);
        products.value = data;
      } catch (error) {
        console.error(error);
      }
    };

    // --- STATS LOGIC ---
    const activeCount = computed(() => {
      const now = new Date();
      return promotions.value.filter(p =>
        new Date(p.startDate) <= now && new Date(p.endDate) >= now
      ).length;
    });

    const scheduledCount = computed(() => {
      const now = new Date();
      return promotions.value.filter(p => new Date(p.startDate) > now).length;
    });

    const totalRedemptions = computed(() => {
      return promotions.value.reduce((sum, p) => sum + (p.usageCount || 0), 0);
    });

    const estimatedSavings = computed(() => {
      return promotions.value.reduce((sum, p) => sum + (p.totalSavings || calculatePromoSavings(p)), 0);
    });

    const calculatePromoSavings = (promo: any) => {
      if (promo.totalSavings !== undefined) return promo.totalSavings;
      const avgOrderValue = 50;
      const usageCount = promo.usageCount || 0;
      if (promo.type === 'percent') {
        return (promo.value / 100) * avgOrderValue * usageCount;
      } else {
        return promo.value * usageCount;
      }
    };

    const showEmailConfirm = ref(false);
    const pendingEmailId = ref<string | null>(null);

    // --- BROADCAST LOGIC ---
    const confirmBroadcast = (id: string) => {
      pendingEmailId.value = id;
      showEmailConfirm.value = true;
    };

    const cancelBroadcast = () => {
      showEmailConfirm.value = false;
      pendingEmailId.value = null;
    };

    const proceedBroadcast = async () => {
      if (!pendingEmailId.value) return;
      const id = pendingEmailId.value;
      showEmailConfirm.value = false; 
      sendingPromoId.value = id;
      try {
        const { data } = await axios.post(`${API_BASE}/promotions/${id}/broadcast`, {}, getAuthHeader());
        toast.info(data.message || "Broadcast started!");
      } catch (error: any) {
        console.error("Broadcast failed", error);
        toast.error(error.response?.data?.message || "Failed to start broadcast");
      } finally {
        sendingPromoId.value = null;
        pendingEmailId.value = null;
      }
    };

    // --- CRUD ACTIONS ---
    const savePromotion = async () => {
      if(!form.code || !form.value || !form.endDate) {
        toast.error("Please fill all required fields");
        return;
      }
      if(form.campaignType === 'product_discount' && form.applicableProducts.length === 0) {
        toast.error("Please select at least one product for Product Discount");
        return;
      }

      try {
        const payload = {
          ...form,
          applicableProducts: form.applicableProducts.length > 0 ? form.applicableProducts : undefined,
          minPurchase: form.campaignType === 'promo_code' ? (form.minPurchase !== undefined ? form.minPurchase : undefined) : undefined
        };

        if (isEditing.value && editingId.value) {
          await axios.put(`${API_BASE}/promotions/${editingId.value}`, payload, getAuthHeader());
          toast.success("Campaign Updated!");
        } else {
          await axios.post(`${API_BASE}/promotions`, payload, getAuthHeader());
          toast.success("Campaign Created!");
        }

        closeModal();
        fetchPromotions();
      } catch (error: any) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to save");
      }
    };

    const editPromo = (promo: any) => {
      isEditing.value = true;
      editingId.value = promo._id;
      form.code = promo.code;
      form.type = promo.type;
      form.value = promo.value;
      form.startDate = promo.startDate.slice(0, 10);
      form.endDate = promo.endDate.slice(0, 10);
      form.usageLimit = promo.usageLimit || 0;
      form.applicableProducts = promo.applicableProducts?.map((p: any) => p._id || p) || [];
      form.minPurchase = promo.minPurchase || 0;
      form.campaignType = promo.campaignType || 'promo_code';
      showModal.value = true;
    };

    const resetForm = () => {
      Object.assign(form, {
        code: '',
        type: 'percent',
        value: 0,
        startDate: new Date().toISOString().slice(0, 10),
        endDate: '',
        usageLimit: 0,
        applicableProducts: [],
        minPurchase: 0,
        campaignType: 'promo_code'
      });
      isEditing.value = false;
      editingId.value = null;
    };

    const closeModal = () => {
      showModal.value = false;
      resetForm();
    };

    const showDeleteConfirm = ref(false);
    const pendingDeleteId = ref<string | null>(null);

    const deletePromo = (id: string) => {
      pendingDeleteId.value = id;
      showDeleteConfirm.value = true;
    };

    const confirmDelete = async () => {
      if (!pendingDeleteId.value) return;
      try {
        await axios.delete(`${API_BASE}/promotions/${pendingDeleteId.value}`, getAuthHeader());
        toast.success("Deleted");
        fetchPromotions();
      } catch (e) {
        toast.error("Delete failed");
      } finally {
        showDeleteConfirm.value = false;
        pendingDeleteId.value = null;
      }
    };

    const cancelDelete = () => {
      showDeleteConfirm.value = false;
      pendingDeleteId.value = null;
    };

    const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const formatMoney = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);

    const getStatusText = (p: any) => {
      const now = new Date();
      if (new Date(p.endDate) < now) return 'Expired';
      if (new Date(p.startDate) > now) return 'Scheduled';
      return 'Active';
    };

    const getStatusClass = (p: any) => {
      const status = getStatusText(p);
      if (status === 'Active') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      if (status === 'Expired') return 'bg-slate-100 text-slate-500 border-slate-200';
      return 'bg-blue-50 text-blue-700 border-blue-100';
    };

    const copyCode = (code: string) => {
      navigator.clipboard.writeText(code);
      toast.info("Copied!");
    };

    const openModal = () => {
      resetForm();
      showModal.value = true;
    };

    onMounted(() => {
      fetchPromotions();
      fetchProducts();
    });

    return {
      promotions, products, isLoading, showModal, form, isEditing,
      openModal, closeModal, savePromotion, editPromo, deletePromo,
      formatDate, formatMoney, getStatusText, getStatusClass, copyCode,
      activeCount, scheduledCount, totalRedemptions, estimatedSavings, calculatePromoSavings,
      showDeleteConfirm, confirmDelete, cancelDelete,
      confirmBroadcast, cancelBroadcast, proceedBroadcast, showEmailConfirm,
      sendingPromoId
    };
  }
});
</script>
