import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    // Load from local storage if available, otherwise start empty
    items: JSON.parse(localStorage.getItem('cartItems') || '[]') as any[],
    promoCode: localStorage.getItem('cartPromoCode') || '',
    promoType: localStorage.getItem('cartPromoType') || '', // 'fixed' or 'percent'
    promoValue: Number(localStorage.getItem('cartPromoValue')) || 0,
  }),

  getters: {
    // Count total items (e.g., 2 shirts + 1 hat = 3 items)
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    // Calculate total price
    subtotal: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),

    // Dynamic Discount Calculation
    discountAmount: (state): number => {
      if (!state.promoCode) return 0;
      const subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);

      if (state.promoType === 'percent') {
        return (subtotal * state.promoValue) / 100;
      } else if (state.promoType === 'fixed') {
        // Ensure discount doesn't exceed subtotal
        return Math.min(state.promoValue, subtotal);
      }
      return 0;
    }
  },

  actions: {
    addToCart(product: any) {
      // Check if item is already in cart
      const existingItem = this.items.find((item) => item._id === product._id);

      if (existingItem) {
        existingItem.quantity++;
        // Update price info in case it changed (e.g. discount applied)
        // Round to 2 decimals to ensure Total = Sum(Components)
        existingItem.price = Number(Number(product.price).toFixed(2));
        existingItem.originalPrice = product.originalPrice;
        existingItem.hasDiscount = product.hasDiscount;
      } else {
        this.items.push({
          _id: product._id,
          name: product.name,
          price: Number(Number(product.price).toFixed(2)),
          image: product.imageUrl || product.image,
          category: product.category,
          quantity: 1,
          originalPrice: product.originalPrice,
          hasDiscount: product.hasDiscount,
        });
      }
      this.saveToLocalStorage();
    },

    removeFromCart(productId: string) {
      this.items = this.items.filter((item) => item._id !== productId);
      // Auto-remove promo if cart is empty
      if (this.items.length === 0) {
        this.clearPromo();
      } else {
        this.saveToLocalStorage();
      }
    },

    updateQuantity(productId: string, change: number) {
      const item = this.items.find((item) => item._id === productId);
      if (item) {
        item.quantity += change;
        // If quantity drops to 0, remove the item
        if (item.quantity <= 0) {
          this.removeFromCart(productId);
          return; // removeFromCart handles saving
        }
      }
      this.saveToLocalStorage();
    },

    clearCart() {
      this.items = [];
      this.clearPromo(); // Also clears promo
      // saveToLocalStorage called in clearPromo
    },

    applyPromo(code: string, type: string, value: number) {
      this.promoCode = code;
      this.promoType = type;
      this.promoValue = value;
      this.saveToLocalStorage();
    },

    clearPromo() {
      this.promoCode = '';
      this.promoType = '';
      this.promoValue = 0;
      this.saveToLocalStorage();
    },

    // Manual saving function (Works without plugins)
    saveToLocalStorage() {
      localStorage.setItem('cartItems', JSON.stringify(this.items));
      localStorage.setItem('cartPromoCode', this.promoCode);
      localStorage.setItem('cartPromoType', this.promoType);
      localStorage.setItem('cartPromoValue', this.promoValue.toString());
    }
  },
});
