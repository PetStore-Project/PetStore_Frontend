import { defineStore } from 'pinia'
import api from '@/services/api'
import { menuItems, type MenuItem } from '@/data/menuItems'

const mapToMenuItem = (item: any): MenuItem => {
  const normalizedId = String(item.id || item._id || crypto.randomUUID())

  return {
    id: normalizedId,
    _id: normalizedId,
    name: item.name || 'Untitled Menu Item',
    price: Number(item.price || 0),
    description: item.description || 'Freshly prepared and served hot.',
    category: item.category || 'Main',
    rating: Number(item.rating || 4.5),
    prepTime: item.prepTime || '15 min',
    image: item.image || item.imageUrl || '',
    stockQuantity: Number(item.stockQuantity || item.stock || 30),
  }
}

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as MenuItem[],
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    totalProducts: (state) => state.products.length,
    lowStockCount: (state) => state.products.filter((p) => (p.stockQuantity || 0) <= 5).length,
    outOfStockCount: (state) => state.products.filter((p) => (p.stockQuantity || 0) === 0).length,
  },

  actions: {
    async fetchProducts() {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await api.get('/products')
        this.products =
          Array.isArray(data) && data.length > 0 ? data.map(mapToMenuItem) : [...menuItems]
      } catch (err: any) {
        console.error('Failed to fetch products:', err)
        this.error = err.response?.data?.message || 'Using local menu items due to network issue'
        this.products = [...menuItems]
      } finally {
        this.isLoading = false
      }
    },

    async createProduct(formData: FormData) {
      this.isLoading = true
      try {
        const config = { headers: { 'Content-Type': 'multipart/form-data' } }
        const { data } = await api.post('/products', formData, config)

        const newItem = mapToMenuItem(data)
        this.products.push(newItem)
        return newItem
      } catch (err: any) {
        console.error('Failed to create product:', err)
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async updateProduct(id: string, formData: FormData) {
      this.isLoading = true
      try {
        const config = { headers: { 'Content-Type': 'multipart/form-data' } }
        const { data } = await api.put(`/products/${id}`, formData, config)

        const updated = mapToMenuItem(data)
        const index = this.products.findIndex((p) => p.id === id || p._id === id)
        if (index !== -1) {
          this.products[index] = updated
        }
        return updated
      } catch (err: any) {
        console.error('Failed to update product:', err)
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async fetchProduct(id: string) {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await api.get(`/products/${id}`)
        return mapToMenuItem(data)
      } catch (err: any) {
        const localMatch = menuItems.find((item) => item.id === id || item._id === id)
        if (localMatch) {
          return localMatch
        }
        console.error('Failed to fetch product:', err)
        this.error = err.response?.data?.message || 'Failed to load product'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async fetchTopProducts() {
      try {
        const { data } = await api.get('/products/top')
        if (Array.isArray(data) && data.length > 0) {
          return data.map(mapToMenuItem)
        }
        return [...menuItems].sort((a, b) => b.rating - a.rating).slice(0, 8)
      } catch (error) {
        console.error(error)
        return [...menuItems].sort((a, b) => b.rating - a.rating).slice(0, 8)
      }
    },

    async addReview(id: string, review: { rating: number; comment: string }) {
      try {
        await api.post(`/products/${id}/reviews`, review)
      } catch (error) {
        throw error
      }
    },

    async deleteProduct(id: string) {
      try {
        await api.delete(`/products/${id}`)
        this.products = this.products.filter((p) => p.id !== id && p._id !== id)
      } catch (err: any) {
        console.error('Failed to delete product:', err)
        throw err
      }
    },
  },
})
