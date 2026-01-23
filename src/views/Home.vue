<template>
    <div class="h-full flex flex-col w-full pb-20">
        
        <div class="px-[69px]">
            <ShowCase :images="imageList"/>
        </div>

        <div class="px-[69px] pt-[69px] pb-[40px]">
            <p class="text-black font-poppins-bold text-[30px] mb-[30px]">Shop for your pet</p>
            <div class="flex justify-between gap-5">
                <PetCategory 
                    v-for="(cate, index) in petCategory" 
                    :key="index" 
                    :petImg="cate.img" 
                    :petName="cate.name"
                />
            </div>
        </div>

        <div class="px-[69px] pt-[30px] pb-[60px]">
            <p class="text-black font-poppins-bold text-[30px] mb-[30px]">Top sell brands</p>
            <div class="flex justify-between items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                <img v-for="i in 5" :key="i" src="https://placehold.co/150x80?text=Brand" alt="Brand Logo" class="h-8 object-contain">
            </div>
        </div>

        <div class="w-full bg-[#005C2D] relative overflow-hidden text-white px-[69px] py-16 flex items-center justify-between">
            <div class="absolute top-0 right-0 opacity-10 pointer-events-none text-9xl">❄</div>

            <div class="max-w-[40%] z-10">
                <h2 class="font-poppins-bold text-[40px] leading-tight mb-4">Buy gifts for<br>your pet</h2>
                <p class="mb-6 font-light">Christmas is coming! Treat your 4-legged friends to something special 🎁</p>
            </div>

            <div class="flex gap-6 z-10">
                <div class="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center w-[200px]">
                    <img :src="petCategory[0].img" class="h-32 object-contain mb-3" alt="Cat">
                    <span class="text-black font-bold">Cat</span>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center w-[200px]">
                    <img :src="petCategory[1].img" class="h-32 object-contain mb-3" alt="Dog">
                    <span class="text-black font-bold">Dog</span>
                </div>
            </div>
        </div>

        <div class="px-[69px] pt-[70px]">
            <div class="flex justify-between items-center mb-[30px]">
                <p class="text-black font-poppins-bold text-[30px]">Top Sell Product</p>
                <a href="#" class="text-gray-500 hover:text-green-600">View all ></a>
            </div>
            
            <div class="grid grid-cols-5 gap-8">
                <ProductCard 
                    v-for="(prod, index) in products" 
                    :key="'top-' + index"
                    :image="prod.img"
                    :name="prod.name"
                    :price="prod.price"
                />
            </div>
        </div>

        <div class="px-[69px] pt-[70px]">
            <p class="text-black font-poppins-bold text-[30px] mb-[30px]">Categories</p>
            <div class="grid grid-cols-3 gap-6">
                <div v-for="(cat, i) in midCategories" :key="i" class="flex flex-col gap-3 group cursor-pointer">
                    <div class="overflow-hidden rounded-xl">
                        <img :src="cat.img" class="w-full h-[250px] object-cover group-hover:scale-110 transition-transform duration-500" alt="">
                    </div>
                    <span class="text-center font-bold text-lg capitalize text-black">{{ cat.name }}</span>
                </div>
            </div>
        </div>

        <div class="px-[69px] pt-[70px] pb-[50px]">
            <p class="text-black font-poppins-bold text-[30px] mb-[30px]">Best rating product</p>
            <div class="grid grid-cols-5 gap-8">
                <ProductCard 
                    v-for="(prod, index) in products" 
                    :key="'best-' + index"
                    :image="prod.img"
                    :name="prod.name"
                    :price="prod.price"
                />
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ShowCase from '@/components/ShowCase.vue';
import PetCategory from '@/components/PetCategory.vue';
import ProductCard from '@/components/ProductCard.vue';

// Image Imports
import img1 from '@/assets/Rectangle 34.png';
import img2 from '@/assets/Rectangle 31.png';
import img3 from '@/assets/Rectangle 32.png';
import img4 from '@/assets/Rectangle 33.png';

// Pet Categories
import petImg1 from '@/assets/petImage/Rectangle 131.png';
import petImg2 from '@/assets/petImage/Rectangle 131 (1).png';
import petImg3 from '@/assets/petImage/Rectangle 131 (2).png';
import petImg4 from '@/assets/petImage/Rectangle 131 (3).png';
import petImg5 from '@/assets/petImage/Rectangle 131 (4).png';

// Product Placeholders (You can replace these with real product images)
import prodImg1 from '@/assets/petImage/Rectangle 131.png'; 

// Category Placeholders
import catFood from '@/assets/petImage/Rectangle 131.png'; 

export default defineComponent({
    name: 'Home',
    components: {
        ShowCase,
        PetCategory,
        ProductCard
    },
    data() {
        return {
            imageList: [img1, img2, img3, img4],
            petCategory: [
                { img: petImg1, name: "Cat" },
                { img: petImg2, name: "Dog" },
                { img: petImg3, name: "Small pet" },
                { img: petImg4, name: "Bird" },
                { img: petImg5, name: "Fish" }
            ],
            // Mock Data for Products
            products: [
                { name: "Royal Canin", price: "67.67$", img: prodImg1 },
                { name: "Whiskas", price: "45.00$", img: prodImg1 },
                { name: "Pedigree", price: "55.20$", img: prodImg1 },
                { name: "Cat Chow", price: "30.50$", img: prodImg1 },
                { name: "Friskies", price: "28.99$", img: prodImg1 },
            ],
            // Mock Data for Middle Categories
            midCategories: [
                { name: "Food", img: catFood },
                { name: "Toy", img: catFood },
                { name: "Accessories", img: catFood }
            ]
        };
    }
})
</script>

<style scoped>
/* Optional: If you need specific font overrides not in Tailwind */
.font-poppins-bold {
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
}
</style>