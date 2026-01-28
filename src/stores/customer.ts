import { defineStore } from 'pinia';
import api from '@/services/api';

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    customers: [] as any[],
    isLoading: false,
    error: null as string | null,

    // Details Modal State
    selectedUser: null as any,
    userOrders: [] as any[],
    isLoadingOrders: false
  }),

  actions: {
    async fetchCustomers() {
      this.isLoading = true;
      try {
        const { data } = await api.get('/auth/users');
        this.customers = data;
      } catch (err: any) {
        console.error("Failed to fetch customers:", err);
        this.error = err.response?.data?.message || "Failed to load customers";
      } finally {
        this.isLoading = false;
      }
    },

    async toggleBlockStatus(user: any) {
      const newStatus = !user.isBlocked;
      try {
        await api.put(`/auth/users/${user._id}/block`, { isBlocked: newStatus });

        // Update local state
        const target = this.customers.find(c => c._id === user._id);
        if (target) target.isBlocked = newStatus;

        return newStatus; // Return status for toast message
      } catch (err: any) {
         // Optimistic update fallback (if 404/mock API issue user mentioned)
        if (err.response?.status === 404) {
           const target = this.customers.find(c => c._id === user._id);
           if (target) target.isBlocked = newStatus;
           return newStatus;
        }
        console.error("Failed to toggle block:", err);
        throw err;
      }
    },

    async fetchUserOrders(userId: string) {
       this.isLoadingOrders = true;
       this.userOrders = [];
       try {
         // Assuming backend has query param or filter support, or filtering client side as before
         // Original code: await axios.get(`${API_BASE}/orders`); then filter.
         // Better to use backend filter if available, but sticking to identical logic for safety:
         const { data } = await api.get('/orders');
         this.userOrders = data.filter((o: any) => o.user?._id === userId);
       } catch (err: any) {
         console.error("Failed to fetch user orders:", err);
       } finally {
         this.isLoadingOrders = false;
       }
    }
  }
});
