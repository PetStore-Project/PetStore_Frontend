<template>
  <div class="min-h-screen bg-gray-50 font-poppins pb-20">
    <div class="h-48 bg-brand-primary/5 border-b border-gray-100 flex items-center justify-center">
       <div class="text-center">
         <h1 class="text-4xl font-black text-gray-900 mb-2">Privacy Policy</h1>
         <p class="text-brand-primary font-bold">Last Updated: April 2026</p>
       </div>
    </div>

    <div class="max-w-[1280px] mx-auto px-6 md:px-12 -mt-10">
      <div class="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 max-w-4xl mx-auto text-gray-600 space-y-8 leading-relaxed">
        
        <section class="border-l-4 border-brand-primary pl-6">
          <h2 class="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide">1. Information We Collect</h2>
          <p>
            To deliver your favorite meals, **Kean24** collects information you provide directly to us. This includes your name, email, 
            <span class="font-bold text-gray-800">delivery address</span>, phone number, and payment preferences. We also collect precise 
            location data to help our riders find you faster.
          </p>
        </section>

        <section class="border-l-4 border-brand-primary pl-6">
          <h2 class="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide">2. How We Use Your Information</h2>
          <p>
            We use your data to process food orders, provide real-time delivery tracking, and send you "Order Ready" notifications. 
            Occasionally, we may send you delicious discounts or "Happy Hour" deals if you've opted into our foodie newsletter.
          </p>
        </section>

        <section class="border-l-4 border-brand-primary pl-6">
          <h2 class="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide">3. Information Sharing</h2>
          <p>
            We respect your privacy. We only share necessary details (like your address and name) with our **Delivery Partners** and the **Restaurants** preparing your food. We never sell your personal data to third parties.
          </p>
        </section>

        <section class="border-l-4 border-brand-primary pl-6">
          <h2 class="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide">4. Data Security</h2>
          <p>
            Your security is our priority. **Kean24** uses industry-standard encryption to protect your account and payment details. 
            We recommend using a unique password to keep your "Foodie Account" safe.
          </p>
        </section>

        <section class="border-l-4 border-brand-primary pl-6">
          <h2 class="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide">5. Contact Kean24 Support</h2>
          <p>
            If you have any questions regarding your data or want to request account deletion, please reach out to our 
            Privacy Team at <a href="mailto:privacy@kean24.com" class="text-brand-primary font-bold hover:underline">privacy@kean24.com</a>.
          </p>
        </section>

        <div class="pt-10 text-center">
          <button 
            @click="$router.push('/')" 
            class="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-brand-primary transition-colors shadow-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PrivacyPolicy',
});
</script>