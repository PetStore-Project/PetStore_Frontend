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
import { useAuthStore } from '@/stores/auth';
import { useCustomerStore } from '@/stores/customer'; // Import Store

// Components
import AdminPageHeader from '@/components/Admin/Shared/AdminPageHeader.vue';
import AdminStatsGrid from '@/components/Admin/Shared/AdminStatsGrid.vue';
import CustomerListTable from '@/components/Admin/Customers/CustomerListTable.vue';
import CustomerDetailsModal from '@/components/Admin/Customers/CustomerDetailsModal.vue';

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
    const customerStore = useCustomerStore(); // Init Store
    const search = ref('');
    const toast = ref('');

    // Sync search
    watch(() => props.globalSearch, (newVal) => {
      search.value = newVal || '';
    });

    // Modal state
    const showModal = ref(false);
    const selectedUser = ref<any>(null);
    // const userOrders = ref<any[]>([]); // Moved to store
    // const loadingOrders = ref(false);  // Moved to store
    const adminNotes = ref('');


    // Search Logic
    const filteredCustomers = computed(() => {
      if (!search.value) return customerStore.customers;
      const q = search.value.toLowerCase();
      return customerStore.customers.filter(c =>
        c.firstName?.toLowerCase().includes(q) ||
        c.lastName?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
      );
    });

    const newTodayCount = computed(() => {
      const today = new Date().toDateString();
      return customerStore.customers.filter(c => new Date(c.createdAt).toDateString() === today).length;
    });

    const showToast = (msg: string) => {
      toast.value = msg;
      setTimeout(() => { toast.value = ''; }, 3000);
    };

    // User Actions
    const toggleBlock = async (user: any) => {
      try {
        const newStatus = await customerStore.toggleBlockStatus(user);
        showToast(newStatus ? 'User blocked' : 'User unblocked');
      } catch (error: any) {
         showToast('Failed to update user status');
      }
    };

    const openUserDetails = async (user: any) => {
      selectedUser.value = user;
      showModal.value = true;
      adminNotes.value = localStorage.getItem(`admin_notes_${user._id}`) || '';
      await customerStore.fetchUserOrders(user._id);
    };

    const closeModal = () => {
      showModal.value = false;
      selectedUser.value = null;
      customerStore.userOrders = []; // Clear store/view? View usually clears. Store logic left valid.
      // Manually clear to prevent stale flash if next load slow
      // Actually actions usually reset. Our action resets it.
    };

    // Save admin note
    const saveNotes = () => {
      if (selectedUser.value) {
        localStorage.setItem(`admin_notes_${selectedUser.value._id}`, adminNotes.value);
        showToast('Notes saved');
      }
    };

    onMounted(() => {
        customerStore.fetchCustomers();
    });

    return {
      customerStore, // Expose store
      customers: computed(() => customerStore.customers), // Keep for template compat if needed, or use store directly
      loading: computed(() => customerStore.isLoading),
      search, filteredCustomers,
      newTodayCount, toggleBlock, toast,
      showModal, selectedUser, openUserDetails, closeModal,
      userOrders: computed(() => customerStore.userOrders),
      loadingOrders: computed(() => customerStore.isLoadingOrders),
      adminNotes, saveNotes
    };
  }
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
