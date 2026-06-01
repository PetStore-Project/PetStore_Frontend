<template>
  <div class="min-h-screen bg-white font-sans text-gray-900">

    <section class="relative bg-[#FFF9F9] overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32">
      <div class="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-red-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-amber-50 rounded-full blur-3xl opacity-50"></div>

      <div class="max-w-[1280px] mx-auto px-6 md:px-12 relative z-10">
        <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          <div class="flex-1 text-center lg:text-left">
            <span class="inline-block py-1 px-3 rounded-full bg-red-100 text-brand-primary text-xs font-bold tracking-widest uppercase mb-6">
              Est. 2026 • Phnom Penh
            </span>
            <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              More Than Delivery, <br>
              We Are <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-orange-600">Flavor.</span>
            </h1>
            <p class="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Welcome to Kean24. We are on a mission to bring the authentic taste of Khmer kitchens 
              and international favorites directly to your table, fresh and fast.
            </p>
            <router-link
              to="/shop"
              class="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-full font-bold hover:brightness-110 transition shadow-lg shadow-red-200 hover:-translate-y-1"
            >
              Explore Menu
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </router-link>
          </div>

          <div class="flex-1 relative w-full max-w-lg lg:max-w-none">
            <div class="relative z-10 bg-white p-2 rounded-[3rem] shadow-2xl rotate-2 hover:rotate-0 transition duration-500">
               <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" alt="Delicious Khmer Meal" class="w-full h-auto rounded-[2.5rem] bg-gray-50" />
            </div>
          </div>

        </div>
      </div>
    </section>

    <section class="py-20 bg-white">
      <div class="max-w-[1280px] mx-auto px-6 md:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div class="order-2 lg:order-1">
             <div class="relative">
                <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80" alt="Kitchen Interior" class="rounded-3xl shadow-xl w-full object-cover h-[500px]" />
                <div class="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden md:block">
                   <div class="flex gap-8">
                      <div class="text-center">
                         <div class="text-2xl font-bold text-brand-primary">10k+</div>
                         <div class="text-xs text-gray-500 font-bold uppercase">Meals Served</div>
                      </div>
                      <div class="w-px bg-gray-200"></div>
                      <div class="text-center">
                         <div class="text-2xl font-bold text-brand-primary">50+</div>
                         <div class="text-xs text-gray-500 font-bold uppercase">Partner Chefs</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div class="order-1 lg:order-2">
            <h2 class="text-3xl font-bold mb-6">The Kean24 Story</h2>
            <p class="text-gray-600 mb-6 leading-relaxed">
              It started with a simple craving: the desire for high-quality, authentic Khmer street food delivered with modern convenience. 
              We realized that the best flavors are often hidden in the "Kean" (corners) of the city.
            </p>
            <p class="text-gray-600 mb-8 leading-relaxed">
              That's why we curate a menu that balances traditional recipes with modern international favorites, 
              ensuring every bite is a memory in the making.
            </p>

            <div class="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
                <span class="w-2 h-8 bg-brand-primary rounded-full"></span>
                Our Promise
              </h3>
              <ul class="space-y-4">
                <li v-for="(item, index) in approachList" :key="index" class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full bg-red-100 text-brand-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span class="text-gray-700 text-sm font-medium">{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>

    <section class="py-20 bg-[#FFFDFD]">
      <div class="max-w-[1280px] mx-auto px-6 md:px-12">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2 class="text-3xl font-bold mb-4">Why Foodies Love Kean24</h2>
          <p class="text-gray-500">We don't just deliver food; we deliver a premium dining experience to your doorstep.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(feature, index) in features" :key="index" class="bg-white p-8 rounded-2xl shadow-sm border border-red-50/50 hover:shadow-xl hover:-translate-y-1 transition duration-300 group">
            <div class="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-brand-primary mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors">
               <div v-html="feature.icon" class="w-7 h-7"></div>
            </div>
            <h3 class="font-bold text-lg mb-2">{{ feature.title }}</h3>
            <p class="text-gray-500 text-sm leading-relaxed">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24 bg-white overflow-hidden">
      <div class="max-w-[1280px] mx-auto px-6 md:px-12">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-extrabold mb-4">Loved by <span class="text-brand-primary">Foodies</span> Across the City</h2>
          <p class="text-gray-500">See what our customers are saying about their favorite Kean24 meals!</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="review in reviews"
            :key="review.name"
            class="relative bg-brand-primary rounded-3xl p-8 pt-12 shadow-xl shadow-red-100 hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full group"
          >
            <div class="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
               <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
            </div>

            <div class="absolute -top-10 left-1/2 -translate-x-1/2">
               <div class="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                  <img :src="review.userImage" :alt="review.name" class="w-full h-full object-cover transform hover:scale-110 transition duration-500" />
               </div>
            </div>

            <div class="flex justify-center text-[#FFD700] mb-6 mt-4 gap-1">
               <span v-for="star in 5" :key="star">
                 <svg class="w-5 h-5 fill-current drop-shadow-sm" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
               </span>
            </div>

            <p class="text-white font-medium text-center italic mb-8 leading-relaxed flex-grow">
              "{{ review.text }}"
            </p>

            <div class="text-center border-t border-white/20 pt-6 mt-auto">
              <h4 class="font-bold text-lg text-white mb-1">{{ review.name }}</h4>
              <p class="text-xs text-red-100 font-bold uppercase tracking-widest">
                 Ordered: {{ review.lastOrder }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AboutPage',
  setup() {

    const approachList = [
      "Authentic Khmer recipes passed down through generations",
      "Fresh, locally sourced ingredients from Cambodian farmers",
      "Hygienic kitchen standards and eco-friendly packaging",
      "Modern delivery technology for the fastest service in town"
    ];

    const features = [
      {
        title: 'Fast Delivery',
        desc: 'Our 24-minute target ensures your food arrives hot and fresh.',
        icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
      },
      {
        title: 'Premium Quality',
        desc: 'We only partner with top-rated restaurants and local artisans.',
        icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>'
      },
      {
        title: 'Easy Ordering',
        desc: 'A seamless UI designed for a hungry stomach. Two clicks to order.',
        icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>'
      },
      {
        title: 'Eco-Packaging',
        desc: 'Reducing plastic waste with our biodegradable food containers.',
        icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>'
      }
    ];

    const reviews = [
      {
        name: "Sophea Rath",
        lastOrder: "Nom Banh Chok",
        userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
        text: "Kean24 is my go-to for breakfast! The Nom Banh Chok tastes just like my grandmother's. Delivery is always on point."
      },
      {
        name: "Dara Som",
        lastOrder: "Angkor Burger",
        userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
        text: "The best burger delivery in Phnom Penh. The packaging keeps the fries crispy, which is usually impossible!"
      },
      {
        name: "James White",
        lastOrder: "Fish Amok",
        userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
        text: "As an expat, I love how easy the app is to use. The food quality is consistent and the drivers are very professional."
      },
      {
        name: "Voleak Keo",
        lastOrder: "Iced Coffee",
        userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&auto=format&fit=crop",
        text: "Super fast shipping even during rain. You can really tell they care about their customers. Highly recommended!"
      }
    ];

    return {
      approachList,
      features,
      reviews
    };
  }
});
</script>