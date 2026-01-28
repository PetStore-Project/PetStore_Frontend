import { defineStore } from 'pinia';
import api from '@/services/api';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as any[], // Typing as any for flexibility, can be improved later
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    // We can move filtered logic here if we want global filtering,
    // but view-specific filters are often best kept in the view or a composable.
    // For now, we just expose the raw list.
    totalProducts: (state) => state.products.length,
    lowStockCount: (state) => state.products.filter(p => (p.stockQuantity || p.stock || 0) <= 5).length,
    outOfStockCount: (state) => state.products.filter(p => (p.stockQuantity || p.stock || 0) === 0).length
  },

  actions: {
    async fetchProducts() {
      this.isLoading = true;
      this.error = null;
      try {
        const { data } = await api.get('/products');
        this.products = data;
      } catch (err: any) {
        console.error("Failed to fetch products:", err);
        this.error = err.response?.data?.message || "Failed to load products";
      } finally {
        this.isLoading = false;
      }
    },

    async createProduct(formData: FormData) {
      this.isLoading = true;
      try {
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        const { data } = await api.post('/products', formData, config);

        // Optimistically add to list
        this.products.push(data);
        return data;
      } catch (err: any) {
        console.error("Failed to create product:", err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async updateProduct(id: string, formData: FormData) {
      this.isLoading = true;
      try {
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        const { data } = await api.put(`/products/${id}`, formData, config);

        // Update list
        const index = this.products.findIndex(p => p._id === id);
        if (index !== -1) {
            this.products[index] = data;
        }
        return data;
      } catch (err: any) {
        console.error("Failed to update product:", err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchProduct(id: string) {
       this.isLoading = true;
       this.error = null;
       try {
         const { data } = await api.get(`/products/${id}`);
         return data;
       } catch (err: any) {
         console.error("Failed to fetch product:", err);
         this.error = err.response?.data?.message || "Failed to load product";
         throw err;
       } finally {
         this.isLoading = false;
       }
    },

    async fetchTopProducts() {
        try {
            const { data } = await api.get('/products/top');
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    async addReview(id: string, review: { rating: number, comment: string }) {
        try {
            await api.post(`/products/${id}/reviews`, review);
        } catch (error) {
            throw error;
        }
    },

    async deleteProduct(id: string) {
       try {
         await api.delete(`/products/${id}`);
         // Remove from list
         this.products = this.products.filter(p => p._id !== id);
       } catch (err: any) {
         console.error("Failed to delete product:", err);
         throw err;
       }
    }
  }
});
