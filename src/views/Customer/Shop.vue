<template>
  <main class="min-h-screen bg-brand-background px-4 py-6 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <section class="mb-6 rounded-3xl bg-white p-5 shadow-sm sm:p-6">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 class="text-2xl font-extrabold text-gray-900 sm:text-3xl">Food Menu</h1>
            <p class="text-sm text-gray-500">Find your next favorite dish.</p>
          </div>
          <button
            v-if="hasActiveFilters"
            @click="resetFilters"
            class="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-brand-primary transition hover:bg-red-100"
          >
            Clear Filters
          </button>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label class="flex items-center gap-2 rounded-2xl border border-gray-200 px-3 py-2">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Search menu items..."
              class="w-full border-none bg-transparent text-sm text-gray-700 outline-none"
            />
          </label>

          <select
            v-model="selectedCategory"
            class="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none"
          >
            <option v-for="cat in categoryItems" :key="cat" :value="cat">{{ cat }}</option>
          </select>

          <select
            v-model="selectedSort"
            class="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none"
          >
            <option v-for="sort in sortItems" :key="sort" :value="sort">{{ sort }}</option>
          </select>
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
          <button
            v-for="filter in cuisineFilters"
            :key="filter"
            @click="selectedCuisine = filter"
            class="rounded-full px-4 py-2 text-sm font-semibold transition"
            :class="
              selectedCuisine === filter
                ? 'bg-brand-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-amber-100'
            "
          >
            {{ filter }}
          </button>
        </div>
      </section>

      <section>
        <div
          v-if="loading"
          class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <div v-for="n in 8" :key="n" class="h-72 animate-pulse rounded-3xl bg-gray-200"></div>
        </div>

        <div
          v-else-if="error"
          class="rounded-3xl border border-red-100 bg-white p-10 text-center text-red-500 shadow-sm"
        >
          {{ error }}
        </div>

        <div v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id || product._id"
            :product="product"
          />
        </div>

        <div v-if="!loading && !error && filteredProducts.length === 0" class="py-16 text-center">
          <h3 class="text-xl font-bold text-gray-900">No dishes matched your filters</h3>
          <p class="mt-1 text-gray-500">Try a different category, cuisine, or search term.</p>
        </div>
      </section>
    </div>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useProductStore } from '@/stores/product'
import ProductCard from '../../components/ProductCard.vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

export default defineComponent({
  name: 'ShopPage',
  components: { ProductCard },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const productStore = useProductStore()

    // Use store state
    const { products, isLoading: loading, error } = storeToRefs(productStore)

    const cuisineFilters = ['All', 'Rice Dishes', 'Local Sets', 'Soups']
    const categoryItems = ['All', 'Appetizer', 'Main', 'Dessert', 'Drink']
    const sortItems = ['Default', 'Price: Low to High', 'Price: High to Low', 'Name: A-Z']

    const searchTerm = ref(((route.query.q as string) || '').trim())
    const selectedCuisine = ref('All')

    const initCategory = (route.query.category as string) || ''
    const findCat = (name: string) =>
      categoryItems.find((c) => c.toLowerCase() === name.toLowerCase())

    const selectedCategory = ref(findCat(initCategory) || 'All')
    const selectedSort = ref('Default')

    watch(
      () => route.query.category,
      (newVal: any) => {
        const val = newVal as string
        if (!val) return
        const matchedCat = findCat(val)
        if (matchedCat) selectedCategory.value = matchedCat
      },
    )

    watch(
      () => route.query.q,
      (newVal: any) => {
        searchTerm.value = ((newVal as string) || '').trim()
      },
    )

    const fetchProducts = async () => {
      await productStore.fetchProducts()
    }

    const filteredProducts = computed(() => {
      const searchQuery = searchTerm.value.toLowerCase()
      let result = products.value.filter((product) => {
        const searchMatch =
          product.name.toLowerCase().includes(searchQuery) ||
          (product.description && product.description.toLowerCase().includes(searchQuery))

        const catMatch =
          selectedCategory.value === 'All' || product.category === selectedCategory.value
        const cuisineMatch =
          selectedCuisine.value === 'All' ||
          product.name.toLowerCase().includes(selectedCuisine.value.toLowerCase()) ||
          product.description.toLowerCase().includes(selectedCuisine.value.toLowerCase())

        const productsParam = route.query.products as string
        let productMatch = true

        if (productsParam) {
          const targetNames = productsParam.split(',').map((n) => n.trim().toLowerCase())
          productMatch = targetNames.some((target) => product.name.toLowerCase().includes(target))
        }

        return searchMatch && catMatch && cuisineMatch && productMatch
      })

      // Apply sorting
      if (selectedSort.value === 'Price: Low to High') {
        result = [...result].sort((a, b) => a.price - b.price)
      } else if (selectedSort.value === 'Price: High to Low') {
        result = [...result].sort((a, b) => b.price - a.price)
      } else if (selectedSort.value === 'Name: A-Z') {
        result = [...result].sort((a, b) => a.name.localeCompare(b.name))
      }

      return result
    })

    const hasActiveFilters = computed(() => {
      const hasQuery = Object.keys(route.query).length > 0
      return (
        selectedCuisine.value !== 'All' ||
        selectedCategory.value !== 'All' ||
        selectedSort.value !== 'Default' ||
        searchTerm.value.length > 0 ||
        hasQuery
      )
    })

    const resetFilters = () => {
      selectedCuisine.value = 'All'
      selectedCategory.value = 'All'
      selectedSort.value = 'Default'
      searchTerm.value = ''
      router.replace({ query: {} })
    }

    onMounted(() => {
      fetchProducts()
    })

    return {
      products,
      loading,
      error,
      cuisineFilters,
      categoryItems,
      sortItems,
      searchTerm,
      selectedCuisine,
      selectedCategory,
      selectedSort,
      filteredProducts,
      resetFilters,
      hasActiveFilters,
    }
  },
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
