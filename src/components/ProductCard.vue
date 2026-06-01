<template>
  <article
    class="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
  >
    <router-link
      :to="{ name: 'product-detail', params: { id: itemId } }"
      class="relative block h-48 overflow-hidden bg-[#fff7ed]"
    >
      <img
        :src="resolvedImage"
        :alt="product.name"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <span
        class="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700"
      >
        {{ product.category }}
      </span>

      <button
        @click.stop.prevent="toggleWishlist"
        class="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-500 shadow-sm transition hover:border-red-200 hover:text-red-500"
        :class="isWishlisted ? 'border-red-200 text-red-500' : ''"
        :title="isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'"
      >
        <HeartSolidIcon v-if="isWishlisted" class="h-5 w-5" />
        <HeartIcon v-else class="h-5 w-5" />
      </button>
    </router-link>

    <div class="flex flex-1 flex-col p-4 sm:p-5">
      <div class="mb-2 flex items-center justify-between">
        <h3 class="line-clamp-1 text-base font-bold text-gray-900 sm:text-lg">
          {{ product.name }}
        </h3>
        <span class="rounded-full bg-brand-primary px-3 py-1 text-sm font-bold text-white">
          ${{ Number(product.price).toFixed(2) }}
        </span>
      </div>

      <p class="line-clamp-2 text-sm text-gray-500">{{ product.description }}</p>

      <div class="mt-4 flex items-center justify-between">
        <div class="flex items-center gap-2 text-xs text-gray-500">
          <StarIcon class="h-4 w-4 text-amber-500" />
          <span>{{ Number(product.rating || 0).toFixed(1) }}</span>
          <span class="text-gray-300">•</span>
          <span>{{ product.prepTime || '15 min' }}</span>
        </div>

        <button
          @click.prevent="addToCart"
          class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary text-white transition hover:bg-red-600 active:scale-95"
          title="Add to cart"
        >
          <PlusIcon class="h-5 w-5" />
        </button>
      </div>
    </div>
  </article>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { HeartIcon } from '@heroicons/vue/24/outline'
import { HeartIcon as HeartSolidIcon, PlusIcon, StarIcon } from '@heroicons/vue/24/solid'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'

const props = defineProps<{ product: any }>()

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const itemId = computed(() => props.product.id || props.product._id)
const isWishlisted = computed(() => wishlistStore.isInWishlist(String(itemId.value || '')))

const resolvedImage = computed(() => {
  const path = props.product.image || props.product.imageUrl
  if (!path) return 'https://via.placeholder.com/600x400?text=Food+Item'
  if (String(path).startsWith('http')) return path
  return `https://petstore-backend-api.onrender.com${path}`
})

const addToCart = () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  const success = cartStore.addToCart({
    _id: itemId.value,
    name: props.product.name,
    price: Number(props.product.price),
    image: resolvedImage.value,
    category: props.product.category,
    stockQuantity: props.product.stockQuantity || 50,
  })

  if (!success) {
    toast.warning('Maximum quantity reached for this item')
    return
  }

  toast.success('Added to your order')
}

const toggleWishlist = () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  const wasWishlisted = isWishlisted.value

  wishlistStore.toggleWishlist({
    _id: String(itemId.value || ''),
    name: props.product.name,
    category: props.product.category,
    price: Number(props.product.price),
    image: resolvedImage.value,
    stockQuantity: props.product.stockQuantity || 0,
  })

  toast.info(wasWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
