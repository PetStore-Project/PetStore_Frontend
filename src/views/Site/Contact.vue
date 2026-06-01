<template>
  <div class="min-h-screen bg-gray-50 font-poppins text-[#181818]">

    <header class="relative h-[350px] md:h-[450px] flex items-center justify-center bg-[#FFF5F5] overflow-hidden">
      <div class="absolute top-0 left-0 w-64 h-64 bg-[#FEE2E2] rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 right-0 w-80 h-80 bg-brand-primary rounded-full blur-[100px] opacity-10 translate-x-1/3 translate-y-1/3"></div>

      <div class="relative z-10 text-center px-4 max-w-3xl">
        <span class="text-brand-primary font-bold tracking-widest uppercase text-sm mb-4 block animate-fade-in-up">
          We'd love to hear from you
        </span>
        <h1 class="text-5xl md:text-7xl font-bold text-[#181818] mb-6 leading-tight animate-fade-in-up delay-100">
          Get In <span class="text-brand-primary">Touch</span>
        </h1>
        <p class="text-gray-600 text-lg md:text-xl font-medium max-w-2xl mx-auto animate-fade-in-up delay-200">
          Have a question about your order, our menu, or partnership? The Kean24 team is here to help!
        </p>
      </div>
    </header>

    <div class="max-w-[1280px] mx-auto px-6 md:px-12 -mt-20 relative z-20 pb-20">

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">

        <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-center group">
          <div class="w-16 h-16 bg-red-50 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-2">Call Us</h3>
          <p class="text-gray-500 mb-4 text-sm">Everyday from 7am to 9pm</p>
          <a href="tel:+85512345678" class="text-brand-primary font-bold hover:underline">+855 12 345 678</a>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-center group">
          <div class="w-16 h-16 bg-red-50 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-2">Email Support</h3>
          <p class="text-gray-500 mb-4 text-sm">We reply within 1 hour during service</p>
          <a href="mailto:support@kean24.com" class="text-brand-primary font-bold hover:underline">support@kean24.com</a>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-center group">
          <div class="w-16 h-16 bg-red-50 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-2">Our Office</h3>
          <p class="text-gray-500 mb-4 text-sm">HQ for Partnerships</p>
          <span class="text-brand-primary font-bold block">Phnom Penh, Cambodia</span>
        </div>
      </div>

      <div class="bg-white rounded-[30px] shadow-xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row mb-24">
        <div class="w-full lg:w-1/2 p-10 md:p-14">
          <h2 class="text-3xl font-bold mb-2">Send us a Message</h2>
          <p class="text-gray-500 mb-8">Got a special request or feedback on a meal? Let us know!</p>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-sm font-bold text-gray-700">Full Name</label>
                <input type="text" required class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-primary focus:bg-white transition" placeholder="Sok Dara" />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-bold text-gray-700">Order ID (Optional)</label>
                <input type="text" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-primary focus:bg-white transition" placeholder="#K24-1234" />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-bold text-gray-700">Email Address</label>
              <input type="email" required class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-primary focus:bg-white transition" placeholder="dara@example.com" />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-bold text-gray-700">How can we help?</label>
              <textarea rows="5" required class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-primary focus:bg-white transition resize-none" placeholder="Tell us about your order or inquiry..."></textarea>
            </div>

            <button type="submit" class="w-full bg-brand-primary text-white font-bold py-4 rounded-xl shadow-lg hover:brightness-110 hover:shadow-red-200/50 transition-all transform hover:-translate-y-1">
              Send Message
            </button>
          </form>
        </div>

        <div class="w-full lg:w-1/2 h-[400px] lg:h-auto bg-gray-200 relative">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125061.54471954153!2d104.83243169726562!3d11.57564120000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109513dc76a6d4b%3A0x55c0ad2c0144761!2sPhnom%20Penh!5e0!3m2!1sen!2skh!4v1711612345678!5m2!1sen!2skh"
            class="w-full h-full border-none"
            allowfullscreen loading="lazy"
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
          <div class="absolute bottom-6 left-6 bg-white p-4 rounded-xl shadow-lg max-w-[200px] hidden sm:block">
            <p class="text-xs font-bold text-gray-400 uppercase mb-1">Our Hub</p>
            <p class="text-sm font-bold text-[#181818]">Phnom Penh, Cambodia</p>
          </div>
        </div>
      </div>

      <section class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p class="text-gray-500">Fast answers for hungry people.</p>
        </div>

        <div class="space-y-4">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300"
            :class="activeIndex === index ? 'shadow-md border-brand-primary' : 'hover:border-gray-300'"
          >
            <button
              @click="toggleFaq(index)"
              class="w-full flex justify-between items-center p-6 text-left"
            >
              <span class="font-bold text-lg" :class="activeIndex === index ? 'text-brand-primary' : 'text-black'">
                {{ faq.question }}
              </span>
              <span
                class="transform transition-transform duration-300 text-2xl leading-none"
                :class="activeIndex === index ? 'rotate-45 text-brand-primary' : 'text-gray-400'"
              >
                +
              </span>
            </button>

            <div
              v-show="activeIndex === index"
              class="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4"
            >
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ContactView',
  setup() {
    const activeIndex = ref<number | null>(0);

    const faqs = [
      {
        question: "How fast is the delivery?",
        answer: "Our target is 24-30 minutes for central Phnom Penh. You can track your rider in real-time through the app after your order is confirmed."
      },
      {
        question: "Is there a minimum order amount?",
        answer: "No minimum order! However, orders under $3.00 may have a slightly higher delivery fee. Check your cart for details."
      },
      {
        question: "How do I cancel my order?",
        answer: "Orders can only be cancelled within 2 minutes of placing them, before the kitchen starts preparing your food. Please call our hotline immediately for urgent changes."
      },
      {
        question: "Do you offer catering for events?",
        answer: "Yes! For large orders or office catering, please fill out the contact form above at least 24 hours in advance, and our manager will contact you."
      }
    ];

    const toggleFaq = (index: number) => {
      activeIndex.value = activeIndex.value === index ? null : index;
    };

    const handleSubmit = () => {
      alert('Your message has been sent to the Kean24 team!');
    };

    return {
      activeIndex,
      faqs,
      toggleFaq,
      handleSubmit
    };
  }
});
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
</style>