<template>
  <div class="register-container">
    <transition name="fade">
      <div v-if="notification.visible" :class="['toast-notification', notification.type]">
        <span class="toast-icon">{{ notification.type === 'success' ? '✅' : '❌' }}</span>
        <span class="toast-message">{{ notification.message }}</span>
      </div>
    </transition>

    <div class="card-wrapper">
      <div class="theme-banner">
        <div class="slogan-content">
          <img :src="sloganImage" alt="Where Pets Are Family" class="slogan-img" />
          <div class="visual-elements">
            <img :src="birdhouseImage" alt="Birdhouse with bird" class="birdhouse-img" />
            <img :src="pawsImage" alt="White paw prints" class="paws-img" />
            <img :src="petsImage" alt="Group of pets" class="pets-img" />
          </div>
        </div>
      </div>

      <div class="register-form-area">
        <router-link to="/" class="close-icon" aria-label="Close Registration">
          &times;
        </router-link>

        <div class="form-content">
          <h2>Register</h2>

          <form @submit.prevent="handleRegistration">
            <div class="input-group">
              <label for="email">Email</label>
              <div class="input-wrapper email-wrapper">
                <span class="icon email-icon">✉</span>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                />
              </div>
            </div>

            <div class="input-group">
              <label for="password">Password</label>
              <div class="input-wrapper">
                <span class="icon view-icon" @click="togglePasswordVisibility">
                  👁
                </span>
                <input
                  id="password"
                  v-model="password"
                  :type="passwordVisible ? 'text' : 'password'"
                  required
                />
              </div>
            </div>

            <div class="input-group">
              <label for="confirmPassword">Confirmed Password</label>
              <div class="input-wrapper">
                <span class="icon view-icon" @click="toggleConfirmPasswordVisibility">
                  👁
                </span>
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  :type="confirmPasswordVisible ? 'text' : 'password'"
                  required
                />
              </div>
              <p v-if="passwordsMismatch" class="error-message">
                Passwords do not match!
              </p>
            </div>

            <button type="submit" class="register-button" :disabled="isLoading">
              {{ isLoading ? 'Registering...' : 'Register' }}
            </button>
          </form>

          <div class="separator">
            <hr />
            <span>Or Continue With</span>
            <hr />
          </div>

          <div class="social-login">
            <button type="button" class="social-button google">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
              </svg>
            </button>

            <button type="button" class="social-button facebook">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="30" height="30">
                <path fill="#1877f2" d="M40 20C40 9 31 0 20 0S0 9 0 20c0 10 7.2 18.3 16.9 19.8V25.8h-5.1V20h5.1v-4.4c0-5 3-7.8 7.5-7.8 2.2 0 4.4.4 4.4.4v4.9h-2.5c-2.5 0-3.3 1.5-3.3 3.1V20h5.5l-.9 5.8h-4.6v14C32.8 38.3 40 30 40 20z"/>
              </svg>
            </button>

            <button type="button" class="social-button apple">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" viewBox="0 0 24 24">
                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
              </svg>
            </button>
          </div>

          <div class="login-link">
            Already have an account?
            <router-link to="/login" class="link">Login here</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

// Import Assets
import sloganImage from '../assets/photos/texts.png';
import birdhouseImage from '../assets/photos/birdhouse.png';
import pawsImage from '../assets/photos/paws.png';
import petsImage from '../assets/photos/pets.png';

export default defineComponent({
  name: 'TheRegister',
  setup() {
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const passwordVisible = ref(false);
    const confirmPasswordVisible = ref(false);
    const isLoading = ref(false);
    const router = useRouter();

    const notification = ref({
      visible: false,
      message: '',
      type: 'success'
    });

    const passwordsMismatch = computed(() => 
      (password.value && confirmPassword.value) && (password.value !== confirmPassword.value)
    );

    const showNotification = (message: string, type: 'success' | 'error') => {
      notification.value = { visible: true, message, type };
      setTimeout(() => {
        notification.value.visible = false;
      }, 3000);
    };

    const togglePasswordVisibility = () => {
      passwordVisible.value = !passwordVisible.value;
    };

    const toggleConfirmPasswordVisibility = () => {
      confirmPasswordVisible.value = !confirmPasswordVisible.value;
    };

    const handleRegistration = async () => {
      if (passwordsMismatch.value) {
        showNotification('Error: Passwords must match.', 'error');
        return;
      }

      if (!email.value || !password.value) {
        showNotification('Please fill in all fields.', 'error');
        return;
      }

      isLoading.value = true;

      try {
        const response = await axios.post('http://localhost:3000/api/register', {
          email: email.value,
          password: password.value
        });

        if (response.status === 201) {
          showNotification('Registration Successful! Redirecting...', 'success');
          setTimeout(() => {
            router.push('/login');
          }, 1500);
        }
      } catch (error: any) {
        if (error.response) {
          showNotification(error.response.data.message || 'Registration failed', 'error');
        } else {
          showNotification('Network Error: Is the server running?', 'error');
        }
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    };

    return {
      email,
      password,
      confirmPassword,
      passwordVisible,
      confirmPasswordVisible,
      passwordsMismatch,
      isLoading,
      notification,
      togglePasswordVisibility,
      toggleConfirmPasswordVisibility,
      handleRegistration,
      sloganImage,
      birdhouseImage,
      pawsImage,
      petsImage,
    };
  },
});
</script>

<style scoped>
/* Reset and Container */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.register-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  font-family: 'Poppins', sans-serif;
  background-color: #f4f7f6;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

/* Toast Styling */
.toast-notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  padding: 15px 25px;
  border-radius: 50px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1000;
  min-width: 300px;
  font-weight: 600;
  border-left: 5px solid;
}

.toast-notification.success { border-left-color: #009200; color: #006400; }
.toast-notification.error { border-left-color: #ff0000; color: #d8000c; }

.fade-enter-active, .fade-leave-active { transition: all 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translate(-50%, -20px); }

/* Layout Wrapper */
.card-wrapper {
  display: flex;
  width: 90%;
  max-width: 1100px;
  min-height: 600px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border-radius: 30px;
  overflow: hidden;
  background-color: #fff;
}

/* Banner Side */
.theme-banner {
  flex: 0 0 45%;
  background-color: #AEE2E8;
  padding: 50px 40px 0 40px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.slogan-img { width: 80%; max-width: 220px; z-index: 10; margin-bottom: 20px;}
.visual-elements { position: absolute; inset: 0; pointer-events: none; }
.birdhouse-img { position: absolute; top: 30px; right: -5px; width: 190px; z-index: 10; }
.paws-img { position: absolute; top: 50%; right: 40px; width: 90px; z-index: 10; transform: translateY(-50%); }
.pets-img { position: absolute; bottom: 0; left: 0; width: 100%; max-height: 55%; object-fit: cover; z-index: 5; }

/* Form Side */
.register-form-area {
  flex: 0 0 55%;
  padding: 40px 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.close-icon {
  position: absolute;
  top: 20px;
  right: 30px;
  font-size: 2.5rem;
  color: #333;
  text-decoration: none;
}

.form-content { width: 100%; max-width: 420px; }
h2 { font-size: 2.2rem; text-align: center; margin-bottom: 25px; }

/* Input Styling */
.input-group { margin-bottom: 20px; }
.input-group label { display: block; font-weight: 700; margin-bottom: 8px; }
.input-wrapper {
  display: flex;
  align-items: center;
  border: 2px solid #ddd;
  border-radius: 10px;
  height: 55px;
  padding: 0 15px;
  transition: border-color 0.3s;
}
.input-wrapper:focus-within { border-color: #009200; }
.input-wrapper input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0 10px;
  font-size: 1rem;
}

/* Buttons */
.register-button {
  width: 100%;
  padding: 16px;
  background-color: #009200;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 10px;
}
.register-button:disabled { background-color: #ccc; cursor: not-allowed; }

.separator {
  display: flex;
  align-items: center;
  margin: 25px 0;
  color: #999;
  font-size: 0.85rem;
}
.separator hr { flex: 1; border: 0; border-top: 1px solid #eee; }
.separator span { padding: 0 15px; }

.social-login { display: flex; justify-content: center; gap: 15px; margin-bottom: 25px; }
.social-button {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  border: 1px solid #eee;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
}
.social-button:hover { transform: scale(1.1); }

.login-link { text-align: center; font-size: 0.9rem; }
.login-link .link { color: #009200; font-weight: 700; text-decoration: none; }

.error-message { color: #ff0000; font-size: 0.8rem; margin-top: 5px; }

/* Responsive */
@media (max-width: 992px) {
  .card-wrapper { flex-direction: column; width: 95%; }
  .theme-banner { flex: 0 0 250px; padding: 20px; }
  .register-form-area { padding: 40px 20px; }
}
</style>