<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
    <div class="max-w-[1000px] mx-auto px-6 md:px-12 py-12">
      <h1 class="text-3xl font-bold mb-8">Order History</h1>

      <div v-if="loading" class="space-y-4">
        <div v-for="n in 3" :key="n" class="h-40 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse"></div>
      </div>

      <div v-else-if="orders.length === 0" class="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
        <div class="w-20 h-20 bg-green-50 text-[#009200] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
        </div>
        <h2 class="text-xl font-bold mb-2">No orders yet</h2>
        <p class="text-gray-500 mb-8">Once you order, your history will appear here.</p>
        <router-link to="/shop" class="px-8 py-3 bg-[#009200] text-white font-bold rounded-lg shadow hover:bg-[#007a00] transition">Start Shopping</router-link>
      </div>

      <div v-else class="space-y-6">
        <div v-for="order in orders" :key="order._id" class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
          <div class="bg-gray-50/50 p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div class="space-y-1">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Order Placed</p>
              <p class="font-bold text-gray-900">{{ formatDate(order.createdAt) }}</p>
              <p v-if="getExpiration(order)" class="text-[10px] text-amber-600 font-bold animate-pulse">Expires in {{ getExpiration(order) }}</p>
            </div>
            <div class="space-y-1">
               <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Total</p>
               <p class="font-bold text-[#009200]">${{ order.totalPrice.toFixed(2) }}</p>
            </div>
            <div v-if="!order.isPaid && order.status === 'Pending' && order.paymentMethod === 'Later'" class="ml-4">
               <button @click.stop="openPayment(order)" class="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-lg hover:bg-slate-800 transition transform hover:-translate-y-0.5">
                 Pay Now
               </button>
            </div>
            <div class="ml-auto">
               <StatusBadge :status="order.status || 'Pending'" show-dot />
            </div>
          </div>

          <div class="p-6 space-y-4">
            <div v-for="item in order.orderItems" :key="item._id" class="flex items-center gap-4">
               <div class="w-16 h-16 bg-gray-50 rounded-lg border border-gray-100 p-1">
                 <img :src="item.image" class="w-full h-full object-contain mix-blend-multiply" />
               </div>
               <div>
                 <h4 class="font-bold text-gray-900">{{ item.name }}</h4>
                 <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
               </div>
            </div>
          </div>
        </div>
      </div>

    </div>
    <!-- Payment Method Selection Modal -->
    <transition name="modal-fade">
      <div v-if="showPaymentMethodModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showPaymentMethodModal = false"></div>
        <div class="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8">
           <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-black text-gray-900">Choose Payment Method</h3>
              <button @click="showPaymentMethodModal = false" class="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
           </div>

           <div class="grid gap-4">
              <!-- Bakong KHQR -->
              <div @click="selectPaymentMethod('Bakong')" class="flex items-center gap-4 p-4 border-2 border-gray-100 rounded-2xl cursor-pointer hover:border-red-100 hover:bg-red-50/30 transition shadow-sm hover:shadow-md">
                 <div class="w-14 h-14 bg-red-100 text-[#E60000] rounded-xl flex items-center justify-center"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg></div>
                 <div class="flex-1">
                    <h4 class="font-bold text-gray-900 text-lg">KHQR</h4>
                    <p class="text-sm text-gray-500">Scan with ABA, ACLEDA, Bakong...</p>
                 </div>
                 <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </div>

              <!-- Card (Stripe) -->
              <div @click="selectPaymentMethod('Card')" class="flex flex-col gap-4 p-4 border-2 border-gray-100 rounded-2xl cursor-pointer transition shadow-sm hover:shadow-md" :class="activePaymentMethod === 'Card' ? 'border-blue-500 bg-blue-50/30' : 'hover:border-blue-100 hover:bg-blue-50/30'">
                 <div class="flex items-center gap-4">
                    <div class="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg></div>
                    <div class="flex-1">
                        <h4 class="font-bold text-gray-900 text-lg">Credit / Debit Card</h4>
                        <p class="text-sm text-gray-500">Visa, Mastercard</p>
                    </div>
                 </div>

                 <!-- Stripe Elements Mount Point -->
                 <div v-show="activePaymentMethod === 'Card'" class="mt-2" @click.stop>
                     <div id="card-element-history" class="p-4 bg-white rounded-xl border border-gray-200"></div>
                     <button @click="processCardPayment" :disabled="isProcessing" class="w-full mt-4 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                        <svg v-if="isProcessing" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span v-else>Pay ${{ payAmount.toFixed(2) }}</span>
                     </button>
                 </div>
              </div>

              <!-- Cash -->
              <div @click="selectPaymentMethod('Cash')" class="flex items-center gap-4 p-4 border-2 border-gray-100 rounded-2xl cursor-pointer hover:border-green-100 hover:bg-green-50/30 transition shadow-sm hover:shadow-md">
                 <div class="w-14 h-14 bg-green-100 text-emerald-600 rounded-xl flex items-center justify-center"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></div>
                 <div class="flex-1">
                    <h4 class="font-bold text-gray-900 text-lg">Cash / COD</h4>
                    <p class="text-sm text-gray-500">Pay when you receive the package</p>
                 </div>
                 <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </div>
           </div>
        </div>
      </div>
    </transition>

    <!-- Bakong Payment Modal (Reused) -->
    <transition name="modal-fade">
      <div v-if="showBakongModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" @click="closeBakongModal"></div>

        <div class="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden transform transition-all scale-100">
          <div class="bg-[#E60000] p-6 text-white text-center relative overflow-hidden">
             <div class="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
             <button @click="closeBakongModal" class="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition z-20">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
             </button>
             <h3 class="text-xl font-bold tracking-wide relative z-10">KHQR PAYMENT</h3>
             <p class="text-white/80 text-sm relative z-10">Scan with any Mobile Banking App</p>
          </div>

          <div class="p-8 flex flex-col items-center">
             <div class="flex items-center justify-center gap-6 mb-8 opacity-90">
                <img src="/src/assets/aba_logo.png" class="h-8 object-contain" alt="ABA">
                <div class="w-px h-6 bg-gray-200"></div>
                <img src="/src/assets/acleda_logo.png" class="h-8 object-contain" alt="Acleda">
                <div class="w-px h-6 bg-gray-200"></div>
                <img src="/src/assets/bakong_logo.png" class="h-8 object-contain" alt="Bakong">
             </div>

             <div class="bg-gray-50 px-8 py-4 rounded-2xl border border-gray-100 flex flex-col items-center mb-8 w-full shadow-sm">
                <span class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total to Pay</span>
                <span class="text-4xl font-extrabold text-[#009200]">${{ payAmount.toFixed(2) }}</span>
             </div>

             <div class="relative group">
                <div class="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div class="relative bg-white p-3 rounded-xl border-2 border-gray-100 shadow-inner">
                    <img :src="dynamicQR" alt="Dynamic KHQR" class="w-64 h-64 object-contain mix-blend-multiply rounded-lg" />
                    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1.5 rounded-full shadow-md border border-gray-100">
                        <img src="https://bakong.nbc.gov.kh/images/logo.svg" class="w-8 h-8" alt="KHQR">
                    </div>
                </div>
             </div>

             <div class="mt-8 flex items-center gap-2 text-red-500 font-mono font-bold bg-red-50 px-4 py-1.5 rounded-full text-sm border border-red-100">
                 <svg class="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 <span>Expires in {{ formatTime(timeLeft) }}</span>
             </div>

             <div class="mt-4 flex items-center gap-2 text-gray-400 text-xs font-medium animate-pulse">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                Waiting for payment confirmation...
             </div>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { useOrderStore } from '@/stores/order';
import { useToast } from "vue-toastification";
import { loadStripe } from '@stripe/stripe-js';
import StatusBadge from '@/components/UI/StatusBadge.vue';

export default defineComponent({
  name: 'OrderHistory',
  components: { StatusBadge },
  setup() {
    const orderStore = useOrderStore();
    const orders = ref<any[]>([]);
    const loading = ref(true);

    const toast = useToast();

    // Payment Modal State
    const showBakongModal = ref(false);
    const showPaymentMethodModal = ref(false);
    const dynamicQR = ref('');
    const payAmount = ref(0);
    const timeLeft = ref(900);
    const selectedOrder = ref<any>(null);
    const activePaymentMethod = ref('');
    const isProcessing = ref(false);
    const currentTime = ref(new Date());

    // Stripe
    const stripePromise = loadStripe('pk_test_51SqrHNRy9Ghp6pibtv9MeH7KlqLVHpNwTL4qVXY9wmjDFgAi2n9q9WZWYUQYUtRKOpKjzoy5di5UnTRqIfma0acR001Bkl2B0n');
    let stripe: any = null;
    let elements: any = null;
    let cardElement: any = null;

    let pollingInterval: any = null;
    let timerInterval: any = null;
    let autoSuccessTimer: any = null;
    let tickerInterval: any = null;

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const clearIntervals = () => {
        if (pollingInterval) clearInterval(pollingInterval);
        if (timerInterval) clearInterval(timerInterval);
        if (autoSuccessTimer) clearTimeout(autoSuccessTimer);
    };

    const closeBakongModal = () => {
        clearIntervals();
        showBakongModal.value = false;
        showPaymentMethodModal.value = false;
        activePaymentMethod.value = '';
    };

    const startTimer = () => {
        timeLeft.value = 900;
        timerInterval = setInterval(() => {
            if (timeLeft.value > 0) timeLeft.value--;
            else {
                closeBakongModal();
                toast.error("QR Code Expired");
            }
        }, 1000);
    };

    const startPolling = (orderId: string) => {
        startTimer();
        pollingInterval = setInterval(async () => {
            try {
                const res = await orderStore.fetchOrderPayment(orderId);
                if (res.isPaid) handleSuccess(false, true);
            } catch (e) { }
        }, 3000);

        console.log("Starting 5-second auto-success timer...");
        autoSuccessTimer = setTimeout(() => {
            if (showBakongModal.value) {
                console.log("Simulating success!");
                handleSuccess(true);
            }
        }, 5000);
    };

    // fromPolling=true means backend already confirmed it
    const handleSuccess = async (simulated = false, fromPolling = false) => {
        clearIntervals();

        if (selectedOrder.value) {
             const method = activePaymentMethod.value || (showBakongModal.value ? 'Bakong' : 'Card');

             if (simulated && !fromPolling) {
                try {
                    await orderStore.payOrder(selectedOrder.value._id, {
                        paymentMethod: method,
                        isPaid: true
                    });

                    selectedOrder.value.isPaid = true;
                    selectedOrder.value.paymentMethod = method;
                } catch(e) { console.error("Update failed", e); }
             }
        }

        showBakongModal.value = false;
        showPaymentMethodModal.value = false;
        activePaymentMethod.value = '';
        toast.success("Payment Received Successfully!");
        fetchOrders(); // Refresh to confirm
    };

    const openPayment = (order: any) => {
        selectedOrder.value = order;
        payAmount.value = order.totalPrice;
        showPaymentMethodModal.value = true;
        activePaymentMethod.value = ''; // Reset
    };

    const selectPaymentMethod = async (method: string) => {
        if (!selectedOrder.value) return;
        activePaymentMethod.value = method;

        if (method === 'Bakong') {
             try {
                 const fullOrder = selectedOrder.value;
                 dynamicQR.value = fullOrder.qrImage || "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=bakong_mock_payment";
                 showPaymentMethodModal.value = false;
                 showBakongModal.value = true;
                 startPolling(fullOrder._id);
             } catch(e) { toast.error("Error initiating payment"); }
        }
        else if (method === 'Cash') {
            try {
                await orderStore.payOrder(selectedOrder.value._id, {
                    paymentMethod: 'Cash', // Controller converts to COD if needed
                    isPaid: false
                });

                selectedOrder.value.paymentMethod = 'COD'; // Optimistic update
                selectedOrder.value.status = 'Pending';

                toast.success("Order confirmed as Cash on Delivery.");
                showPaymentMethodModal.value = false;
                fetchOrders();
            } catch(e) {
                console.error(e);
                toast.error("Could not update order. Server Error.");
            }
        }
        else if (method === 'Card') {
            if (!stripe) stripe = await stripePromise;
            if (!elements) elements = stripe.elements();
            setTimeout(() => {
                const mountPoint = document.getElementById('card-element-history');
                if (mountPoint && !cardElement) {
                    cardElement = elements.create('card', {
                        style: { base: { fontSize: '16px', color: '#1f2937' }, invalid: { color: '#ef4444' } },
                        hidePostalCode: true
                    });
                    cardElement.mount('#card-element-history');
                } else if (cardElement) {
                    cardElement.unmount();
                    cardElement.mount('#card-element-history');
                }
            }, 100);
        }
    };

    const processCardPayment = async () => {
        if (!stripe || !cardElement || !selectedOrder.value) return;
        isProcessing.value = true;
        try {
            const paymentItems = selectedOrder.value.orderItems.map((item: any) => ({
                _id: item.product,
                qty: item.quantity
            }));
            const { clientSecret } = await orderStore.createPaymentIntent(paymentItems);

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement, billing_details: { name: 'Customer' } }
            });

            if (result.error) throw new Error(result.error.message);
            if (result.paymentIntent.status === 'succeeded') {
                handleSuccess(true); // Will call API
            }
        } catch(e: any) {
            console.error(e);
            toast.error(e.message || "Payment Failed");
        } finally {
            isProcessing.value = false;
        }
    };

    const getExpiration = (order: any) => {
        // Strict check: Only expire if Pending AND Unpaid AND Not Cash/COD
        if (order.paymentMethod !== 'Later' || order.isPaid || order.status !== 'Pending') return null;

        const created = new Date(order.createdAt);
        const expiresAt = new Date(created.getTime() + 24 * 60 * 60 * 1000);

        const diffMs = expiresAt.getTime() - currentTime.value.getTime();

        if (diffMs <= 0) return null;

        const h = Math.floor(diffMs / (1000 * 60 * 60));
        const m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diffMs % (1000 * 60)) / 1000);

        return `${h}h ${m}m ${s}s`;
    };

    const checkExpirations = async (orderList: any[]) => {
        const now = new Date();
        for (const order of orderList) {
            if (['Cash', 'COD'].includes(order.paymentMethod)) continue;

            if (order.status === 'Pending' && !order.isPaid) {
                const createdAt = new Date(order.createdAt);
                if (now.getTime() - createdAt.getTime() >= 24 * 60 * 60 * 1000) {
                    order.status = 'Cancelled'; // Just visual update
                }
            }
        }
    };

    const fetchOrders = async () => {
      try {
        const data = await orderStore.fetchMyOrders();
        orders.value = data;
        checkExpirations(orders.value);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
        fetchOrders();
        tickerInterval = setInterval(() => { currentTime.value = new Date(); }, 1000);
    });

    onUnmounted(() => {
        clearIntervals();
        if (tickerInterval) clearInterval(tickerInterval);
    });

    return {
      orders, loading, formatDate, formatTime, getExpiration,
      showBakongModal, dynamicQR, payAmount, timeLeft,
      showPaymentMethodModal, openPayment, selectPaymentMethod, closeBakongModal,
      activePaymentMethod, isProcessing, processCardPayment
    };
  }
});
</script>
