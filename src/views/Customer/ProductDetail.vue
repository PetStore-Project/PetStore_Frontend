<template>
  <main class="min-h-screen bg-brand-background pb-14">
    <div v-if="loading" class="flex min-h-[70vh] flex-col items-center justify-center">
      <div
        class="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-brand-primary"
      ></div>
      <p class="mt-4 text-gray-500">Preparing dish details...</p>
    </div>

    <div v-else-if="error || !product" class="flex min-h-[70vh] items-center justify-center px-4">
      <div class="rounded-3xl bg-white p-8 text-center shadow-sm">
        <p class="text-2xl font-bold text-gray-900">Dish Not Found</p>
        <p class="mt-2 text-gray-500">This item is unavailable at the moment.</p>
        <button
          @click="$router.push('/shop')"
          class="mt-5 rounded-2xl bg-brand-primary px-6 py-3 font-semibold text-white"
        >
          Back to Menu
        </button>
      </div>
    </div>

    <div v-else class="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
      <nav class="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <router-link to="/shop" class="hover:text-brand-primary">Menu</router-link>
        <span>/</span>
        <span class="truncate font-medium text-gray-900">{{ product.name }}</span>
      </nav>

      <section
        class="grid gap-6 rounded-3xl bg-white p-5 shadow-sm lg:grid-cols-2 lg:gap-10 lg:p-8"
      >
        <div class="overflow-hidden rounded-3xl bg-[#fff7ed]">
          <img :src="mainImage" :alt="product.name" class="h-72 w-full object-cover sm:h-[420px]" />
        </div>

        <div class="flex flex-col">
          <div class="mb-4 flex items-center gap-2">
            <span class="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-brand-primary">
              {{ product.category }}
            </span>
            <span class="text-sm text-amber-500"
              >★ {{ Number(product.rating || 0).toFixed(1) }}</span
            >
            <span class="text-sm text-gray-400">• {{ product.prepTime || '15 min' }}</span>
          </div>

          <h1 class="text-3xl font-black text-gray-900 sm:text-4xl">{{ product.name }}</h1>
          <p class="mt-3 text-gray-600">{{ product.description }}</p>

          <div class="mt-6 rounded-2xl bg-gray-50 p-4">
            <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Price</p>
            <p class="text-4xl font-black text-brand-primary">
              ${{ Number(product.price).toFixed(2) }}
            </p>
          </div>

          <div class="mt-6 flex flex-col gap-3 sm:flex-row">
            <div class="inline-flex items-center rounded-2xl border border-gray-200 bg-white">
              <button
                @click="quantity > 1 ? quantity-- : null"
                class="px-4 py-3 text-lg font-bold text-gray-500"
              >
                -
              </button>
              <span class="px-4 py-3 text-base font-bold text-gray-900">{{ quantity }}</span>
              <button @click="quantity++" class="px-4 py-3 text-lg font-bold text-gray-500">
                +
              </button>
            </div>

            <button
              @click="addToCart"
              :disabled="isOutOfStock"
              class="rounded-2xl px-6 py-3 font-semibold text-white transition"
              :class="
                isOutOfStock
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-brand-primary hover:bg-red-600'
              "
            >
              {{ isOutOfStock ? 'Out of Stock' : 'Add to Cart' }}
            </button>
          </div>
        </div>
      </section>

      <section class="mt-10 rounded-3xl bg-white p-6 shadow-sm">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-2xl font-extrabold text-gray-900">You May Also Like</h2>
          <router-link to="/shop" class="text-sm font-semibold text-brand-primary hover:underline">
            View all
          </router-link>
        </div>

        <div v-if="recommendedLoading" class="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div v-for="n in 4" :key="n" class="h-52 animate-pulse rounded-3xl bg-gray-200"></div>
        </div>

        <div v-else-if="recommendedProducts.length === 0" class="py-8 text-center text-gray-500">
          Similar dishes are currently unavailable.
        </div>

        <div v-else class="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <router-link
            v-for="rec in recommendedProducts"
            :key="rec.id || rec._id"
            :to="{ name: 'product-detail', params: { id: rec.id || rec._id } }"
            class="group overflow-hidden rounded-3xl border border-gray-100"
          >
            <img
              :src="getImageUrl(rec.imageUrl || rec.image)"
              :alt="rec.name"
              class="h-32 w-full object-cover transition group-hover:scale-105"
            />
            <div class="p-3">
              <p class="line-clamp-1 text-sm font-bold text-gray-900">{{ rec.name }}</p>
              <p class="text-sm font-semibold text-brand-primary">
                ${{ Number(rec.price).toFixed(2) }}
              </p>
            </div>
          </router-link>
        </div>
      </section>
    </div>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useProductStore } from '@/stores/product'
import { useToast } from 'vue-toastification'

// Define your backend URL constant
const BACKEND_URL = 'https://petstore-backend-api.onrender.com'

export default defineComponent({
  name: 'ProductDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const cartStore = useCartStore()
    const authStore = useAuthStore()
    const productStore = useProductStore()
    const toast = useToast()

    const quantity = ref(1)
    const loading = ref(true)
    const error = ref('')
    const product = ref<any>(null)
    const mainImage = ref('')

    // Recommended products
    const allProducts = ref<any[]>([])
    const recommendedLoading = ref(true)
    const recommendedProducts = ref<any[]>([])

    // Helper to fix image paths
    const getImageUrl = (path: string) => {
      if (!path) return 'https://via.placeholder.com/300'
      if (path.startsWith('http') || path.startsWith('blob:')) return path
      return `${BACKEND_URL}${path}`
    }

    const fetchProduct = async () => {
      loading.value = true
      try {
        const id = route.params.id as string
        const data = await productStore.fetchProduct(id)
        product.value = data

        if (product.value) {
          const rawPath = product.value.imageUrl || product.value.image || ''
          mainImage.value = getImageUrl(rawPath)
          fetchRecommendedProducts()
        }
      } catch (err) {
        console.error(err)
        error.value = 'Failed to load product.'
      } finally {
        loading.value = false
      }
    }

    const fetchRecommendedProducts = async () => {
      recommendedLoading.value = true
      try {
        if (productStore.products.length === 0) {
          await productStore.fetchProducts()
        }
        allProducts.value = productStore.products

        if (product.value) {
          recommendedProducts.value = allProducts.value
            .filter(
              (p: any) =>
                p.category === product.value.category &&
                (p.id || p._id) !== (product.value.id || product.value._id),
            )
            .slice(0, 4)
        }
      } catch (err) {
        console.error('Failed to fetch recommended products:', err)
        recommendedProducts.value = []
      } finally {
        recommendedLoading.value = false
      }
    }

    const addToCart = () => {
      if (!authStore.isAuthenticated) {
        router.push('/login')
        return
      }

      if (!product.value) return
      let addedCount = 0
      const productId = product.value.id || product.value._id

      for (let i = 0; i < quantity.value; i++) {
        const success = cartStore.addToCart({
          _id: productId,
          name: product.value.name,
          price: product.value.price,
          category: product.value.category,
          stockQuantity: product.value.stockQuantity,
          image: mainImage.value,
        })
        if (success) addedCount++
      }

      if (addedCount > 0) {
        toast.success(`Added ${addedCount} to Cart!`)
      }
      if (addedCount < quantity.value) {
        toast.warning('Some items could not be added (Stock Limit Reached)')
      }
    }

    onMounted(() => {
      fetchProduct()
    })

    watch(
      () => route.params.id,
      (newId) => {
        if (newId) {
          fetchProduct()
          window.scrollTo(0, 0)
        }
      },
    )

    const isOutOfStock = computed(() => {
      return (product.value?.stockQuantity || 0) <= 0
    })

    return {
      product,
      loading,
      error,
      mainImage,
      quantity,
      addToCart,
      recommendedProducts,
      recommendedLoading,
      getImageUrl,
      isOutOfStock,
    }
  },
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
