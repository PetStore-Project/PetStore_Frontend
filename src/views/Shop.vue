<template>
  <div class="min-h-screen bg-white px-8 md:px-16 pb-4">
    
    <div class="pb-8">
      <Menu 
        layout="row" 
        :items="topTabs" 
        :activeItem="activeTab" 
        @select="switchTab"
      />
    </div>

    <div class="flex flex-col lg:flex-row gap-12">
      
      <aside class="w-full lg:w-64 flex-shrink-0 space-y-8">
        <div>
          <Menu 
            title="Categories" 
            :items="categoryItems" 
            :activeItem="activeCategory"
            @select="activeCategory = $event"
          />
        </div>

        <div class="h-px bg-[#8A8A8A]"></div>

        <div>
          <Menu 
            title="Sort by" 
            :items="sortItems" 
            :activeItem="activeSort"
            @select="activeSort = $event"
          />
        </div>

        <div class="h-px bg-[#8A8A8A]"></div>

        <div>
          <Menu 
            title="Filter by brand" 
            :items="brandItemsWithAll" 
            :activeItem="activeBrandFilter"
            @select="setBrandFilter"
          />
        </div>
      </aside>

      <main class="flex-1">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          <ProductCard 
            v-for="product in filteredProducts" 
            :key="product.id" 
            :product="product"
            @add-to-cart="addToCart"
          />
        </div>

        <div v-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center py-20 text-gray-400">
           <p class="text-xl mb-2">No products found</p>
           <p class="text-sm">Try adjusting your filters</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Menu from '../components/Menu.vue'
import ProductCard from '../components/ProductCard.vue'

// (Define Product interface here if needed, or assume it's imported)

export default defineComponent({
  name: 'Shop',
  components: {
    Menu,
    ProductCard
  },
  data() {
    return {
      // --- State ---
      activeTab: 'All',
      activeCategory: 'All',
      activeSort: 'Default',
      // FIX 1: Rename/re-initialize the brand filter state for clarity and single-select
      activeBrandFilter: 'All', 
      
      // --- Menu Options ---
      topTabs: ['All', 'Cat', 'Dog', 'Small Pet', 'Bird', 'Fish'],
      categoryItems: ['All', 'Food', 'Toy', 'Accessories'],
      sortItems: ['Default', 'Popularity', 'Average rating', 'Price: Low to High', 'Price: High to Low', 'Newness'],
      brandItems: ['Royal Canin', 'Whiskas', 'Pedigree', 'Almo Nature', 'Orijen'],

      // --- Mock Data ---
      products: [
        { id: 1, name: 'Royal Canin Sensible', tab: 'Cat', category: 'Food', brand: 'Royal Canin', price: 67.67, rating: 4.5, popularityScore: 120, description: 'Balanced and complete feed for cats.', image: 'https://placehold.co/200x300?text=Royal+Canin' },
        { id: 2, name: 'Pedigree Adult', tab: 'Dog', category: 'Food', brand: 'Pedigree', price: 45.00, rating: 3.2, popularityScore: 50, description: 'Complete nutrition for adult dogs.', image: 'https://placehold.co/200x300?text=Pedigree' },
        { id: 3, name: 'Catnip Mouse', tab: 'Cat', category: 'Toy', brand: 'Whiskas', price: 5.50, rating: 5.0, popularityScore: 250, description: 'Fun interactive toy for cats.', image: 'https://placehold.co/200x300?text=Toy' },
        { id: 4, name: 'Bird Seed Mix', tab: 'Bird', category: 'Food', brand: 'Almo Nature', price: 12.99, rating: 4.0, popularityScore: 80, description: 'Healthy seed mix for parrots.', image: 'https://placehold.co/200x300?text=Bird+Seed' },
        { id: 5, name: 'Fish Flakes', tab: 'Fish', category: 'Food', brand: 'Orijen', price: 8.50, rating: 3.8, popularityScore: 30, description: 'Premium flakes for tropical fish.', image: 'https://placehold.co/200x300?text=Fish+Food' },
        { id: 6, name: 'Royal Canin Kitten', tab: 'Cat', category: 'Food', brand: 'Royal Canin', price: 70.00, rating: 4.9, popularityScore: 180, description: 'For kittens up to 12 months.', image: 'https://placehold.co/200x300?text=RC+Kitten' },
        { id: 7, name: 'Dog Bone Toy', tab: 'Dog', category: 'Toy', brand: 'Pedigree', price: 15.00, rating: 2.1, popularityScore: 90, description: 'Durable chew toy.', image: 'https://placehold.co/200x300?text=Bone' },
        { id: 8, name: 'Hamster Wheel', tab: 'Small Pet', category: 'Accessories', brand: 'Whiskas', price: 22.00, rating: 4.2, popularityScore: 60, description: 'Silent spinner for hamsters.', image: 'https://placehold.co/200x300?text=Wheel' },
      ]
    }
  },
  computed: {
    brandItemsWithAll(): string[] {
        return ['All', ...this.brandItems];
    },
    
    filteredProducts() {
      // 1. Filter Logic
      let result = this.products.filter((product) => {
        const tabMatch = this.activeTab === 'All' || product.tab === this.activeTab;
        const catMatch = this.activeCategory === 'All' || product.category === this.activeCategory;
        
        // FIX 3: Brand filter logic must check against the single string property `activeBrandFilter`
        const brandMatch = this.activeBrandFilter === 'All' || product.brand === this.activeBrandFilter;

        return tabMatch && catMatch && brandMatch;
      });

      // 2. Sort Logic (Remains the same)
      if (this.activeSort === 'Price: Low to High') {
        result.sort((a, b) => a.price - b.price);
      } else if (this.activeSort === 'Price: High to Low') {
        result.sort((a, b) => b.price - a.price);
      }else if (this.activeSort === 'Average rating'){
        result.sort((a, b) => b.rating - a.rating);
      }else if (this.activeSort === 'Newness') {
        result.sort((a, b) => a.id - b.id);
      } else if (this.activeSort === 'Popularity') {
        result.sort((a, b) => b.popularityScore - a.popularityScore);
      }
      return result;
    }
  },
  methods: {
    switchTab(tab: string) {
      this.activeTab = tab;
      this.activeCategory = 'All';
      this.activeSort = 'Default';
      this.activeBrandFilter = 'All';
    },
    setBrandFilter(brand: string) {
        this.activeBrandFilter = brand;
    },
    addToCart(product: any) {
      console.log('Added to cart:', product.name);
      alert(`${product.name} added to cart!`);
    }
  }
})
</script>