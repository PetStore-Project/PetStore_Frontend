import { defineStore } from 'pinia';
import api from '@/services/api';
import router from '@/router';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  token: string;
}

export const useAuthStore = defineStore('auth', {
  // Initialize state from local storage
  state: () => {
    let userData = null;
    let tokenData = null;

    try {
      const storedUser = localStorage.getItem('user');
      let storedToken = localStorage.getItem('token');

      // Restore session from legacy storage
      if (!storedToken || storedToken === 'undefined') {
          const legacy = localStorage.getItem('userInfo');
          if (legacy) {
              try {
                  const p = JSON.parse(legacy);
                  if (p && p.token) {
                    storedToken = p.token;
                    // Persist to standard storage
                    if (storedToken) localStorage.setItem('token', storedToken);
                  }
              } catch(e) {}
          }
      }

      // Check against "undefined" string to prevent parsing errors
      if (storedUser && storedUser !== 'undefined') {
        userData = JSON.parse(storedUser);
      }
      if (storedToken && storedToken !== 'undefined') {
        tokenData = storedToken;
      }
    } catch (error) {
      console.error("Corrupted local storage detected.", error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }

    return {
      user: userData as User | null,
      token: tokenData as string | null,
      isAuthenticated: !!tokenData,
    };
  },

  actions: {
    async login(email: string, password: string) {
      try {
        const response = await api.post('/auth/login', { email, password });

        // Update state with user data and token
        const { _id, firstName, lastName, role, token } = response.data;
        this.token = token;
        this.user = { _id, firstName, lastName, email, role, token };
        this.isAuthenticated = true;

        // Persist to LocalStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(this.user));

      } catch (error) {
        throw error;
      }
    },

    async register(email: string, password: string) {
      try {
        await api.post('/auth/register', {
          email,
          password,
          firstName: 'Member',
          lastName: 'User'
        });

        // Clear previous session data to ensure a fresh start
        localStorage.removeItem('cartItems');

        // Redirect to login page for verification
        router.push('/login');

      } catch (error) {
        throw error;
      }
    },

    logout() {
      // Reset state
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;

      // Clear local storage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('cartItems');
      sessionStorage.removeItem('hasSeenPromo');

      // Redirect to login
      router.push('/login');
    }
  }
});
