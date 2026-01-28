import { defineStore } from 'pinia';
import api from '@/services/api';

interface Order {
  id: string; // Mapped from _id
  _id?: string; // Original ID from backend
  customer: string;
  email: string;
  date: string; // Mapped from createdAt
  total: number; // Mapped from totalPrice
  status: string;
  isPaid: boolean;
  paidAt?: string;
  paymentMethod?: string;
  shippingAddress?: any;
  orderItems: any[];
  user?: any; // Original user object
}

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [] as Order[],
    isLoading: false,
    error: null as string | null,
    totalPages: 1,
    currentPage: 1,
    pageSize: 8
  }),

  getters: {
    // Helper to get stats
    stats: (state) => {
        const paidStatuses = ['Paid', 'Processing', 'Shipped', 'Delivered'];
        return {
            total: state.orders.length,
            revenue: state.orders.filter(o => paidStatuses.includes(o.status)).reduce((s, o) => s + (o.total || 0), 0),
            paidCount: state.orders.filter(o => o.isPaid).length,
            unpaidCount: state.orders.filter(o => !o.isPaid).length,
            pending: state.orders.filter(o => o.status === 'Pending').length,
            delivered: state.orders.filter(o => o.status === 'Delivered').length
        };
    }
  },

  actions: {
    async fetchOrders() {
      this.isLoading = true;
      this.error = null;
      try {
        const { data } = await api.get('/orders');

        // Map backend data to frontend model
        // We preserve both 'id' (mapped from _id) and original structure to ensure compatibility
        this.orders = data.map((o: any) => ({
          ...o, // Keep all original fields
          id: o._id,
          customer: o.user ? `${o.user.firstName} ${o.user.lastName}` : 'Guest',
          email: o.user ? o.user.email : 'N/A',
          date: o.createdAt,
          total: o.totalPrice,
          status: o.status || 'Pending',
          items: o.orderItems || [], // Map for compatibility if needed
          orderItems: o.orderItems || [],
          isPaid: o.isPaid || false,
          paidAt: o.paidAt,
          paymentMethod: o.paymentMethod || 'N/A',
          shippingAddress: o.shippingAddress
        }));

      } catch (err: any) {
        console.error("Failed to fetch orders:", err);
        this.error = err.response?.data?.message || "Failed to load orders";
      } finally {
        this.isLoading = false;
      }
    },

    async updateStatus(orderId: string, newStatus: string) {
      try {
        await api.put(`/orders/${orderId}/status`, { status: newStatus });

        // Update local state
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
        }
        return true;
      } catch (err: any) {
        console.error("Failed to update status:", err);
        throw err; // Re-throw to let component handle specific UI feedback (toast)
      }
    },

    async markAsPaid(orderId: string) {
      try {
        await api.put(`/orders/${orderId}/pay`, {});

        // Update local state
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.isPaid = true;
            order.status = (order.status === 'Pending') ? 'Processing' : order.status; // Auto-advance if logic dictates, but stick to backend truth usually.
            // Here we just set paid.
        }
        return true;
      } catch (err: any) {
         console.error("Failed to mark paid:", err);
         throw err;
      }
    },

    // Add getOrder helper if needed for details view, though mapped list usually has enough
    getOrderById(id: string) {
        return this.orders.find(o => o.id === id);
    },

    async fetchOrder(id: string) {
        try {
            const { data } = await api.get(`/orders/${id}`);
            return data;
        } catch (err) {
            console.error("Failed to fetch order details", err);
            throw err;
        }
    },
    async createOrder(order: any) {
        try {
            const { data } = await api.post('/orders', order);
            return data;
        } catch (error) {
            throw error;
        }
    },

    async fetchMyOrders() {
        this.isLoading = true;
        try {
            const { data } = await api.get('/orders/myorders');
            return data;
        } catch (error) {
             console.error("Failed to fetch my orders", error);
             throw error;
        } finally {
            this.isLoading = false;
        }
    },

    async fetchOrderPayment(id: string) {
        try {
            const { data } = await api.get(`/orders/${id}/payment`);
            return data;
        } catch (error) {
            throw error;
        }
    },

    async payOrder(id: string, paymentResult: any) {
         try {
            const { data } = await api.put(`/orders/${id}/pay`, paymentResult);
            return data;
         } catch (error) {
             throw error;
         }
    },

    async createPaymentIntent(items: any[]) {
        try {
            const { data } = await api.post('/payment/create-payment-intent', { items });
            return data;
        } catch (error) {
            throw error;
        }
    }
  }
});
