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
    // Count total items
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    // Calculate total price
    subtotal: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),

    // Discount Calculation
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
      const stockLimit = product.stockQuantity || 0;

      if (existingItem) {
        if (existingItem.quantity + 1 > stockLimit) {
          return;
        }
        existingItem.quantity++;
        // Update price info in case it changed (e.g. discount applied)
        existingItem.price = Number(Number(product.price).toFixed(2));
        existingItem.originalPrice = product.originalPrice;
        existingItem.hasDiscount = product.hasDiscount;
        existingItem.stockQuantity = stockLimit; // Keep updated
      } else {
        if (1 > stockLimit) return;

        this.items.push({
          _id: product._id,
          name: product.name,
          price: Number(Number(product.price).toFixed(2)),
          image: product.imageUrl || product.image,
          category: product.category,
          quantity: 1,
          originalPrice: product.originalPrice,
          hasDiscount: product.hasDiscount,
          stockQuantity: stockLimit // Store it
        });
      }
      this.saveToLocalStorage();
      return true;
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

    updateQuantity(productId: string, change: number): boolean {
      const item = this.items.find((item) => item._id === productId);
      if (item) {
        const newQty = item.quantity + change;

        // Prevent exceeding stock
        if (change > 0 && item.stockQuantity && newQty > item.stockQuantity) {
          return false;
        }

        item.quantity = newQty;
        // If quantity drops to 0, remove the item
        if (item.quantity <= 0) {
          this.removeFromCart(productId);
          return true; // Success (removed)
        }
      }
      this.saveToLocalStorage();
      return true;
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

    // Manual saving function
    saveToLocalStorage() {
      localStorage.setItem('cartItems', JSON.stringify(this.items));
      localStorage.setItem('cartPromoCode', this.promoCode);
      localStorage.setItem('cartPromoType', this.promoType);
      localStorage.setItem('cartPromoValue', this.promoValue.toString());
    }
  },
});
