import { defineStore } from 'pinia';
import api from '@/services/api';

export const usePromotionStore = defineStore('promotion', {
  state: () => ({
    promotions: [] as any[],
    isLoading: false,
    error: null as string | null
  }),

  // Add stats getters here if we want to centralize logic,
  // but view-specific computed props are fine too.
  getters: {
    activePromotions: (state) => {
      const now = new Date();
      return state.promotions.filter(p => new Date(p.startDate) <= now && new Date(p.endDate) >= now);
    }
  },

  actions: {
    async fetchPromotions() {
      this.isLoading = true;
      try {
        const { data } = await api.get('/promotions');
        this.promotions = data;
      } catch (err: any) {
        console.error("Failed to fetch promotions:", err);
        this.error = err.response?.data?.message || "Failed to load promotions";
      } finally {
        this.isLoading = false;
      }
    },

    async createPromotion(payload: any) {
       this.isLoading = true;
       try {
         const { data } = await api.post('/promotions', payload);
         this.promotions.push(data);
         return data;
       } catch (err: any) {
         console.error("Failed to create promotion:", err);
         throw err;
       } finally {
         this.isLoading = false;
       }
    },

    async updatePromotion(id: string, payload: any) {
       this.isLoading = true;
       try {
         const { data } = await api.put(`/promotions/${id}`, payload);
         const index = this.promotions.findIndex(p => p._id === id);
         if (index !== -1) this.promotions[index] = data;
         return data;
       } catch (err: any) {
         console.error("Failed to update promotion:", err);
         throw err;
       } finally {
         this.isLoading = false;
       }
    },

    async deletePromotion(id: string) {
       try {
         await api.delete(`/promotions/${id}`);
         this.promotions = this.promotions.filter(p => p._id !== id);
       } catch (err: any) {
         console.error("Failed to delete promotion:", err);
         throw err;
       }
    },

    async broadcastPromotion(id: string) {
        try {
            const { data } = await api.post(`/promotions/${id}/broadcast`, {});
            return data;
        } catch (err: any) {
            console.error("Failed to broadcast promotion:", err);
            throw err;
        }
    },

    async validatePromotion(code: string, cartTotal: number, cartItems: any[]) {
        try {
            const { data } = await api.post('/promotions/validate', { code, cartTotal, cartItems });
            return data;
        } catch (error) {
            throw error;
        }
    }
  }
});
