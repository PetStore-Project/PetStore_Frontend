<template>
  <main class="min-h-screen bg-brand-background font-sans">
    <section class="relative overflow-hidden px-4 pb-10 pt-8 sm:px-6 lg:px-8">
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(224,0,37,0.1),_transparent_45%)]"
      ></div>

      <div
        class="relative mx-auto max-w-6xl rounded-3xl bg-white p-6 shadow-sm sm:p-10 border border-gray-100"
      >
        <div class="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div class="space-y-6">
            <span
              class="inline-flex rounded-full bg-red-50 px-4 py-1 text-xs font-bold uppercase tracking-wider text-brand-primary"
            >
              🇰🇭 Kean24 • Authentic Khmer Flavor
            </span>
            <h1 class="text-4xl font-black leading-tight text-gray-900 sm:text-6xl">
              Delicious Local Food <span class="text-brand-primary">At Your Door</span>
            </h1>
            <p class="text-base text-gray-600">
              From street-side favorites to gourmet Khmer dishes. Fresh, hot, and delivered in 24
              minutes.
            </p>

            <div
              class="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-2 focus-within:border-brand-primary transition-all"
            >
              <MagnifyingGlassIcon class="h-5 w-5 ml-2 text-gray-400" />
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Search Nom Banh Chok, Bai Sach Chrouk..."
                class="w-full border-none bg-transparent text-sm text-gray-700 outline-none p-2"
              />
              <button
                class="rounded-xl bg-brand-primary px-6 py-2.5 text-sm font-bold text-white transition hover:brightness-110 shadow-md"
              >
                Search
              </button>
            </div>

            <div class="flex flex-wrap gap-2 pt-2">
              <button
                v-for="filter in quickFilters"
                :key="filter"
                @click="activeFilter = filter"
                class="rounded-xl px-5 py-2 text-sm font-bold transition-all border"
                :class="
                  activeFilter === filter
                    ? 'bg-brand-primary border-brand-primary text-white shadow-lg'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-brand-primary hover:text-brand-primary'
                "
              >
                {{ filter }}
              </button>
            </div>
          </div>

          <div class="relative rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80"
              alt="Authentic Khmer Food"
              class="h-72 w-full object-cover sm:h-[450px]"
            />
            <div
              class="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-lg"
            >
              <p class="text-xs font-bold text-gray-800">🔥 Most Ordered Today</p>
              <p class="text-sm font-black text-brand-primary">Grilled Pork & Rice</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-black text-gray-900">Popular on Kean24</h2>
          <p class="text-gray-500 text-sm">Our top-rated dishes this week</p>
        </div>
        <button
          @click="router.push('/shop')"
          class="group flex items-center gap-1 text-sm font-bold text-brand-primary"
        >
          View full menu
          <span class="transition-transform group-hover:translate-x-1">→</span>
        </button>
      </div>

      <div v-if="loading" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="n in 6" :key="n" class="h-80 animate-pulse rounded-3xl bg-gray-200"></div>
      </div>

      <div v-else class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <ProductCard v-for="item in khmerItems" :key="item.id" :product="item" />
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import ProductCard from '@/components/ProductCard.vue'
import { useProductStore } from '@/stores/product'

export default defineComponent({
  name: 'Home',
  components: { ProductCard, MagnifyingGlassIcon },
  setup() {
    const router = useRouter()
    const productStore = useProductStore()

    const loading = ref(true)
    const searchTerm = ref('')
    const activeFilter = ref('All')

    // Updated for Khmer Food
    const quickFilters = ['All', 'Khmer Food', 'Burgers', 'Drinks', 'Breakfast']

    // HARDCODED KHMER DATA for your presentation
    const khmerMockData = [
      {
        id: 'k1',
        name: 'Special Bai Sach Chrouk',
        description: 'Authentic grilled pork with broken rice, pickled veggies, and soup.',
        price: 2.5,
        category: 'Breakfast',
        rating: 4.9,
        prepTime: '10 min',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500',
      },
      {
        id: 'k2',
        name: 'Fish Amok (Steam)',
        description: 'Classic Khmer steam curry with river fish and coconut milk.',
        price: 4.5,
        category: 'Khmer Food',
        rating: 4.8,
        prepTime: '25 min',
        image: 'https://images.unsplash.com/photo-1567121938596-6d9d015d3cf8?q=80&w=500',
      },
      {
        id: 'k3',
        name: 'Nom Banh Chok',
        description: 'Traditional Khmer noodles with green curry fish gravy.',
        price: 2.0,
        category: 'Khmer Food',
        rating: 4.7,
        prepTime: '15 min',
        image: 'https://images.unsplash.com/photo-1583210129047-ee3d10787431?q=80&w=500',
      },
      {
        id: 'k4',
        name: 'Iced Coffee with Milk',
        description: 'Strong local brew with sweet condensed milk and ice.',
        price: 1.25,
        category: 'Drinks',
        rating: 5.0,
        prepTime: '5 min',
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=500',
      },
      {
        id: 'k5',
        name: 'Angkor Burger',
        description: 'Beef patty with local spices, fresh greens, and house sauce.',
        price: 3.75,
        category: 'Burgers',
        rating: 4.6,
        prepTime: '20 min',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500',
      },
      {
        id: 'k6',
        name: 'Kuy Teav Phnom Penh',
        description: 'Rice noodle soup with pork bone broth and fresh herbs.',
        price: 3.0,
        category: 'Breakfast',
        rating: 4.8,
        prepTime: '12 min',
        image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=500',
      },
    ]

    const khmerItems = computed(() => {
      const query = searchTerm.value.trim().toLowerCase()

      const sourceItems = productStore.products.length > 0 ? productStore.products : khmerMockData

      return sourceItems.filter((item) => {
        const bySearch = !query || item.name.toLowerCase().includes(query)
        const byFilter = activeFilter.value === 'All' || item.category === activeFilter.value
        return bySearch && byFilter
      })
    })

    const load = async () => {
      loading.value = true
      // Still fetch products in background if you want,
      // but khmerItems uses hardcoded data for now.
      await productStore.fetchProducts()
      loading.value = false
    }

    onMounted(load)

    return {
      router,
      loading,
      searchTerm,
      activeFilter,
      quickFilters,
      khmerItems,
    }
  },
})
</script>
