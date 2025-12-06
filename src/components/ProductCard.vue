<template>
  <div class="group border border-[#F2F2F2] rounded-2xl p-4 relative bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col h-full">
    
<button class="absolute top-4 right-4 z-10 hover:scale-110 transition-transform">
      <svg width="20" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
              stroke="black" 
              stroke-width="1.5" 
              stroke-linecap="round" 
              stroke-linejoin="round"
              class="group-hover:stroke-[#008C00] transition-colors"
        />
      </svg>
    </button>
    <div class="h-48 w-full flex items-center justify-center mb-4">
      <img :src="product.image" :alt="product.name" class="max-h-full max-w-full object-contain" />
    </div>

    <div class="flex gap-1 mb-2">
      <span v-for="i in 5" :key="i">
        <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 0L8.5716 4.83688H13.6574L9.5429 7.82624L11.1145 12.6631L7 9.67376L2.8855 12.6631L4.4571 7.82624L0.342604 4.83688H5.4284L7 0Z" fill="#F4A340"/>
        </svg>
      </span>
    </div>

    <h4 class="font-poppins font-semibold text-base text-[#181818] mb-1 line-clamp-1">{{ product.name }}</h4>
    <p class="font-poppins text-xs text-gray-400 mb-4 flex-grow line-clamp-2">{{ product.description }}</p>

    <div class="flex justify-between items-center mt-auto">
      <span class="font-poppins font-bold text-xl text-[#008C00]">{{ product.price }}$</span>
      
      <button 
        @click="$emit('add-to-cart', product)"
        class="w-10 h-10 bg-[#008C00] rounded-lg flex items-center justify-center hover:bg-[#006b00] transition-colors shadow-md"
      >
        <svg width="20" height="20" viewBox="0 0 25 25" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.2517 25C6.58696 25 6.0179 24.7552 5.54453 24.2656C5.07115 23.776 4.83447 23.1875 4.83447 22.5C4.83447 21.8125 5.07115 21.224 5.54453 20.7344C6.0179 20.2448 6.58696 20 7.2517 20C7.91644 20 8.4855 20.2448 8.95887 20.7344C9.43225 21.224 9.66893 21.8125 9.66893 22.5C9.66893 23.1875 9.43225 23.776 8.95887 24.2656C8.4855 24.7552 7.91644 25 7.2517 25ZM19.3379 25C18.6731 25 18.1041 24.7552 17.6307 24.2656C17.1573 23.776 16.9206 23.1875 16.9206 22.5C16.9206 21.8125 17.1573 21.224 17.6307 20.7344C18.1041 20.2448 18.6731 20 19.3379 20C20.0026 20 20.5717 20.2448 21.045 20.7344C21.5184 21.224 21.7551 21.8125 21.7551 22.5C21.7551 23.1875 21.5184 23.776 21.045 24.2656C20.5717 24.7552 20.0026 25 19.3379 25ZM6.22438 5L9.12506 11.25H17.5854L20.9091 5H6.22438ZM5.07619 2.5H22.9033C23.3666 2.5 23.7191 2.71354 23.9608 3.14062C24.2025 3.56771 24.2126 4 23.991 4.4375L19.7005 12.4375C19.4789 12.8542 19.1818 13.1771 18.8091 13.4062C18.4364 13.6354 18.0285 13.75 17.5854 13.75H8.58118L7.2517 16.25H21.7551V18.75H7.2517C6.34524 18.75 5.66035 18.3385 5.19705 17.5156C4.73375 16.6927 4.7136 15.875 5.13662 15.0625L6.76825 12L2.41723 2.5H0V0H3.928L5.07619 2.5Z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  name: 'ProductCard',
  props: {
    product: {
      type: Object as PropType<any>,
      required: true
    }
  },
  emits: ['add-to-cart']
})
</script>