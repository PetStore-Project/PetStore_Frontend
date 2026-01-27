<template>
  <div class="min-h-screen flex flex-col bg-white font-poppins">
    <Navigation />

    <main class="flex-grow">
      <RouterView />
    </main>

    <AppFooter />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, h } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // Added useRouter
import Navigation from '../components/navigation.vue';
import AppFooter from '../components/AppFooter.vue';
import { useToast } from "vue-toastification";

export default defineComponent({
  name: 'CustomerLayout',
  components: {
    Navigation,
    AppFooter
  },
  setup() {
    const toast = useToast();
    const route = useRoute();
    const router = useRouter(); // Initialize router
    let promoTimer: any = null;

    onMounted(() => {
      // 🛑 Block Toast on Admin Pages
      if (route.path.startsWith('/admin')) return;

      const hasSeenPromo = sessionStorage.getItem('hasSeenPromo');

      if (!hasSeenPromo) {
           // Define the Toast Component
          const ModernToast = () => h('div', { class: 'flex items-center w-full gap-4' }, [
             h('div', { class: 'flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-sm' }, [
                h('svg', { class: 'w-6 h-6 text-white drop-shadow-sm', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: '2.5' }, [
                     h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' })
                ])
             ]),
             h('div', { class: 'flex-1 min-w-0' }, [
                h('h4', { class: 'font-extrabold text-white text-lg leading-tight drop-shadow-sm' }, 'Lunar New Year Deal 🧧'),
                h('p', { class: 'text-green-50 text-sm mt-1 font-medium' }, 'Free shipping over 50$')
             ]),
             h('button', {
                class: 'bg-white text-[#009200] text-sm font-extrabold px-4 py-2 rounded-full shadow-md hover:bg-green-50 hover:scale-105 transition-all cursor-pointer',
                onClick: () => {
                  router.push('/shop');
                  toast.clear(); // Clear the toast on click
                }
             }, 'Shop')
          ]);

          // Trigger the Toast
          promoTimer = setTimeout(() => {
            // 🛑 Double Check: If user navigated to Admin during the 2s wait
            if (route.path.startsWith('/admin')) return;

            toast(ModernToast, {
                timeout: 8000,
                closeButton: true,
                icon: false,
                toastClassName: "petstore-modern-toast",
            });

            sessionStorage.setItem('hasSeenPromo', 'true');

          }, 2000);
      }
    });

    onUnmounted(() => {
        if (promoTimer) clearTimeout(promoTimer);
    });

    return {};
  }
});
</script>

<style>
/* 1. Push the Container Down (Below Navbar) */
.Vue-Toastification__container.top-right {
    top: 90px !important; /* Adjust based on your header height */
}

/* 2. Increase Toast Size & Padding */
.petstore-modern-toast {
    background: linear-gradient(135deg, #009200 0%, #007a00 100%) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    border-radius: 20px !important;
    padding: 20px 24px !important; /* Much bigger padding */
    box-shadow: 0 20px 40px -6px rgba(0, 146, 0, 0.5) !important;
    overflow: visible !important;
    align-items: center !important;
    min-width: 380px !important; /* Wider card */
}

/* 3. Bigger Close Button */
.petstore-modern-toast .Vue-Toastification__close-button {
    color: rgba(255, 255, 255, 0.7) !important;
    padding-left: 15px !important;
    font-size: 24px !important;
}
.petstore-modern-toast .Vue-Toastification__close-button:hover {
    color: white !important;
}
</style>
