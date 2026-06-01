<template>
  <div class="min-h-screen bg-gray-50 font-poppins pb-20">
    <div class="h-48 bg-brand-primary/5 border-b border-gray-100 flex items-center justify-center">
       <div class="text-center px-4">
         <h1 class="text-4xl font-black text-gray-900 mb-2">Terms & Conditions</h1>
         <p class="text-brand-primary font-bold tracking-widest uppercase text-xs">Agreement for Kean24 Services</p>
       </div>
    </div>

    <div class="max-w-[1280px] mx-auto px-6 md:px-12 -mt-10">
      <div class="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 max-w-4xl mx-auto text-gray-600 space-y-8 leading-relaxed">
        
        <section class="group">
          <div class="flex items-center gap-3 mb-3">
            <div class="h-8 w-1 bg-brand-primary rounded-full"></div>
            <h2 class="text-xl font-bold text-gray-900 uppercase tracking-wide">1. Acceptance of Terms</h2>
          </div>
          <p>
            Welcome to **Kean24**. By accessing our website or mobile application, you agree to be bound by these Terms and Conditions. 
            Our service provides a platform for users to discover and order food from local restaurants and vendors in Cambodia.
          </p>
        </section>

        <section class="group">
          <div class="flex items-center gap-3 mb-3">
            <div class="h-8 w-1 bg-brand-primary rounded-full"></div>
            <h2 class="text-xl font-bold text-gray-900 uppercase tracking-wide">2. Service Availability</h2>
          </div>
          <p>
            **Kean24** strives to deliver your food within the estimated timeframes (typically 24-30 minutes). However, delivery times 
            may be affected by weather, traffic, or kitchen delays. We reserve the right to limit service areas based on rider availability.
          </p>
        </section>

        <section class="group">
          <div class="flex items-center gap-3 mb-3">
            <div class="h-8 w-1 bg-brand-primary rounded-full"></div>
            <h2 class="text-xl font-bold text-gray-900 uppercase tracking-wide">3. Pricing & Payment</h2>
          </div>
          <p>
            All prices listed are in <span class="font-bold text-gray-800">USD</span>. Total order costs include the dish price, 
            applicable taxes, and a delivery fee. Payment can be made via KHQR, Credit Card, or Cash on Delivery (COD). 
            Once an order is "In Preparation," it cannot be cancelled or refunded.
          </p>
        </section>

        <section class="group">
          <div class="flex items-center gap-3 mb-3">
            <div class="h-8 w-1 bg-brand-primary rounded-full"></div>
            <h2 class="text-xl font-bold text-gray-900 uppercase tracking-wide">4. Limitation of Liability</h2>
          </div>
          <p>
            **Kean24** acts as an intermediary. While we ensure high standards for our riders, the quality and safety of the food 
            are the responsibility of the preparing restaurant. We are not liable for any health issues arising from food allergies 
            not disclosed at the time of ordering.
          </p>
        </section>

        <section class="group">
          <div class="flex items-center gap-3 mb-3">
            <div class="h-8 w-1 bg-brand-primary rounded-full"></div>
            <h2 class="text-xl font-bold text-gray-900 uppercase tracking-wide">5. Governing Law</h2>
          </div>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of the 
            <span class="font-bold text-gray-800">Kingdom of Cambodia</span>. Any disputes shall be resolved exclusively within the 
            jurisdiction of the courts in Phnom Penh.
          </p>
        </section>

        <div class="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p class="text-sm italic">Thank you for choosing Kean24 for your daily meals.</p>
          <button 
            @click="$router.push('/')" 
            class="bg-brand-primary text-white px-10 py-3 rounded-2xl font-bold hover:brightness-110 transition-all shadow-lg shadow-red-200"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TermsConditions',
});
</script>