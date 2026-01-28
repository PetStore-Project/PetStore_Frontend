<template>
  <div class="w-full min-h-screen">


    <AdminPageHeader title="Customers" description="View and manage your user base.">
      <template #actions>
        <div class="relative">
          <input 
            v-model="search" 
            type="text" 
            placeholder="Search customers..." 
            class="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none w-64 shadow-sm transition"
          >
          <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </template>
    </AdminPageHeader>


    <AdminStatsGrid>
      <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div class="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        </div>
        <div>
          <p class="text-slate-400 text-xs font-bold uppercase tracking-wide">Total Users</p>
          <p class="text-2xl font-black text-slate-900">{{ customers.length }}</p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div class="p-3 bg-blue-50 text-blue-600 rounded-2xl">
           <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <div>
          <p class="text-slate-400 text-xs font-bold uppercase tracking-wide">Admins</p>
          <p class="text-2xl font-black text-slate-900">{{ customers.filter(c => c.role === 'admin').length }}</p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div class="p-3 bg-amber-50 text-amber-600 rounded-2xl">
           <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <div>
          <p class="text-slate-400 text-xs font-bold uppercase tracking-wide">Blocked</p>
          <p class="text-2xl font-black text-slate-900">{{ customers.filter(c => c.isBlocked).length }}</p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div class="p-3 bg-purple-50 text-purple-600 rounded-2xl">
           <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
        </div>
        <div>
          <p class="text-slate-400 text-xs font-bold uppercase tracking-wide">New Today</p>
          <p class="text-2xl font-black text-slate-900">{{ newTodayCount }}</p>
        </div>
      </div>
    </AdminStatsGrid>


    <CustomerListTable 
      :customers="filteredCustomers" 
      :loading="loading"
      @open-details="openUserDetails"
      @toggle-block="toggleBlock"
    />


    <CustomerDetailsModal
      :is-open="showModal"
      :user="selectedUser"
      :orders="userOrders"
      :loading-orders="loadingOrders"
      v-model:notes="adminNotes"
      @close="closeModal"
      @save-notes="saveNotes"
      @toggle-block="toggleBlock(selectedUser); closeModal();"
    />


    <transition name="fade">
      <div v-if="toast" class="fixed bottom-6 right-6 z-[100] bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-bold">
        <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
        {{ toast }}
      </div>
    </transition>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

// Components
import AdminPageHeader from '@/components/Admin/Shared/AdminPageHeader.vue';
import AdminStatsGrid from '@/components/Admin/Shared/AdminStatsGrid.vue';
import CustomerListTable from '@/components/Admin/Customers/CustomerListTable.vue';
import CustomerDetailsModal from '@/components/Admin/Customers/CustomerDetailsModal.vue';

const API_BASE = "https://petstore-backend-api.onrender.com/api";

export default defineComponent({
  name: 'Customers',
  components: { 
    AdminPageHeader, 
    AdminStatsGrid, 
    CustomerListTable, 
    CustomerDetailsModal 
  },
  props: ['globalSearch'],
  setup(props) {
    const authStore = useAuthStore();
    const customers = ref<any[]>([]);
    const loading = ref(true);
    const search = ref('');
    const toast = ref('');

    // Sync search
    watch(() => props.globalSearch, (newVal) => {
      search.value = newVal || '';
    });

    // Modal state
    const showModal = ref(false);
    const selectedUser = ref<any>(null);
    const userOrders = ref<any[]>([]);
    const loadingOrders = ref(false);
    const adminNotes = ref('');

    const getAuthHeader = () => {
      let token = authStore.token;
      if (!token) {
         const stored = localStorage.getItem('userInfo');
         if (stored) token = JSON.parse(stored).token;
      }
      return { headers: { Authorization: `Bearer ${token}` } };
    };

    // --- API CALLS ---
    const fetchCustomers = async () => {
      loading.value = true;
      try {
        const { data } = await axios.get(`${API_BASE}/auth/users`, getAuthHeader());
        customers.value = data;
      } catch (error) {
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    // --- SEARCH LOGIC ---
    const filteredCustomers = computed(() => {
      if (!search.value) return customers.value;
      const q = search.value.toLowerCase();
      return customers.value.filter(c =>
        c.firstName?.toLowerCase().includes(q) ||
        c.lastName?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
      );
    });

    const newTodayCount = computed(() => {
      const today = new Date().toDateString();
      return customers.value.filter(c => new Date(c.createdAt).toDateString() === today).length;
    });

    const showToast = (msg: string) => {
      toast.value = msg;
      setTimeout(() => { toast.value = ''; }, 3000);
    };

    // --- USER ACTIONS ---
    const toggleBlock = async (user: any) => {
      const newStatus = !user.isBlocked;
      try {
        await axios.put(`${API_BASE}/auth/users/${user._id}/block`, { isBlocked: newStatus }, getAuthHeader());
        user.isBlocked = newStatus;
        showToast(newStatus ? 'User blocked' : 'User unblocked');
      } catch (error: any) {
        if (error.response?.status === 404) {
          user.isBlocked = newStatus;
          showToast(`${newStatus ? 'Blocked' : 'Unblocked'} (API not available)`);
        } else {
          console.error(error);
          showToast('Failed to update user status');
        }
      }
    };

    const fetchUserOrders = async (userId: string) => {
      loadingOrders.value = true;
      userOrders.value = [];
      try {
        const { data } = await axios.get(`${API_BASE}/orders`, getAuthHeader());
        userOrders.value = data.filter((o: any) => o.user?._id === userId);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        loadingOrders.value = false;
      }
    };

    const openUserDetails = async (user: any) => {
      selectedUser.value = user;
      showModal.value = true;
      adminNotes.value = localStorage.getItem(`admin_notes_${user._id}`) || '';
      await fetchUserOrders(user._id);
    };

    const closeModal = () => {
      showModal.value = false;
      selectedUser.value = null;
      userOrders.value = [];
    };

    // Save admin note
    const saveNotes = () => {
      if (selectedUser.value) {
        localStorage.setItem(`admin_notes_${selectedUser.value._id}`, adminNotes.value);
        showToast('Notes saved');
      }
    };

    onMounted(fetchCustomers);

    return { 
      customers, loading, search, filteredCustomers, 
      newTodayCount, toggleBlock, toast,
      showModal, selectedUser, openUserDetails, closeModal,
      userOrders, loadingOrders, 
      adminNotes, saveNotes
    };
  }
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
