<script setup>
import { ref } from 'vue';
import { toy } from '@/assets';

const props = defineProps({
  productName: String,
  rating: Number,
  description: String,
  price: Number,
  image: String,
  category: String
});

// Heart state
const liked = ref(false);
const hover = ref(false);
</script>

<template>
  <div class="w-[200px] border border-[#8A8A8A] rounded-sm overflow-hidden shadow-sm bg-white">
    
    <!-- Image with heart icon -->
    <div 
      class="relative"
      @mouseenter="hover = true" 
      @mouseleave="hover = false"
    >
      <img :src="toy" class="w-full h-48 object-cover">
      
      <!-- Heart -->
      <font-awesome-icon
        v-if="liked || hover"
        icon="fa-solid fa-heart"
        class="absolute top-2 right-2 text-[#008C00] text-2xl cursor-pointer transition"
        @click="liked = !liked"
      />
      <font-awesome-icon
        v-else
        icon="fa-regular fa-heart"
        class="absolute top-2 right-2 text-black text-2xl cursor-pointer transition"
        @click="liked = !liked"
      />
    </div>

    <!-- Rating and product name -->
    <div class="px-1 pt-2">
      <div class="flex items-center mb-1">
        <!-- Rating stars using v-for -->
        <span class="flex">
          <font-awesome-icon
            v-for="i in Math.floor(props.rating ?? 0)"
            :key="'filled' + i"
            icon="fa-solid fa-star"
            class="text-[#fdbc2c] mr-0.5"
          />
          <font-awesome-icon
            v-for="i in 5 - Math.floor(props.rating ?? 0)"
            :key="'empty' + i"
            icon="fa-regular fa-star"
            class="text-gray-300 mr-0.5"
          />
        </span>
        <span class="text-sm text-gray-500 ml-2.5">{{ props.rating || 3 }}</span>
      </div>

      <h1 class="text-black text-lg font-bold truncate">
        {{ props.productName || "Product name" }}
      </h1>

      <!-- Description -->
      <p class="text-[#B0B0B0] text-sm mt-1 wrap-break-word">
        {{ props.description || "hfahgjahfhjadfkjahdfdfasdhfkajsddhfjakfadfkjafkajdlfajlf" }}
      </p>
    </div>

    <!-- Price and cart button -->
    <div class="flex items-center justify-between px-1 py-1 border-[#E0E0E0]">
      <div>
        <h3 class="text-[#008C00] text-2xl font-bold">
          {{ props.price ? `$${props.price}` : "66.77$" }}
        </h3>
      </div>
      <button class="bg-[#008C00] w-10 h-10 flex items-center justify-center rounded-sm hover:bg-green-700 transition">
        <font-awesome-icon icon="fa-solid fa-cart-shopping" class="text-white"/>
      </button>
    </div>

  </div>
</template>
