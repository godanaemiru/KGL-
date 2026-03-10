<template>
  <div class="login-page">
    <div class="login-card">
      <div class="logo-container">
        <svg class="sprout-icon" width="56" height="56" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="margin: 0 auto;">
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 14 5.25 9 6.25C4 7.25 2 11.5 2 13.5C2 15.5 3.75 17.25 3.75 17.25C7 8 17 8 17 8Z"/>
        </svg>
        <h1 class="brand-name">Karibu Groceries</h1>
        <p class="tagline">Digitizing the Black Books</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        
        <div class="input-group">
          <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <input 
            v-model="username" 
            type="text" 
            placeholder="Username" 
            required 
          />
        </div>

        <div class="input-group">
          <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <input 
            v-model="password" 
            type="password" 
            placeholder="Password" 
            required 
          />
        </div>

        <button type="submit" :disabled="loading" class="access-btn">
          {{ loading ? 'AUTHENTICATING...' : 'ACCESS PORTAL' }}
        </button>
      </form>

      <div class="footer-links">
        <p>© 2024 Karibu Groceries LTD</p>
        <p>• Maganjo & Matugga Branches •</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';
// Import toaster if you have it set up as per conversation
import { useToast } from "vue-toastification";

const username = ref('');
const password = ref('');
const loading = ref(false);
const router = useRouter();
const toast = useToast();

const handleLogin = async () => {
  loading.value = true;
  try {
    // API request to your Node.js backend
    const response = await api.post('/auth/login', {
      username: username.value,
      password: password.value
    });
    
    // Save authentication details in localStorage
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('role', response.data.role);
    localStorage.setItem('branch', response.data.branch);
    localStorage.setItem('username', username.value);

    // Show success toaster
    toast.success(`Welcome back, ${username.value}!`);

    // Redirect based on the defined role as per conversation logic
    if (response.data.role === 'director') router.push('/dashboard');
    else if (response.data.role === 'manager') router.push('/inventory');
    else router.push('/sales'); // Default redirect for sales agents
    
  } catch (err) {
    // Handle login errors with an error toaster
    toast.error(err.response?.data?.message || "Invalid credentials. Try again.");
    console.error("Login Error:", err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Full page background using the specific young sprout field image */
.login-page {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  
  /* The specific background image from your screenshot */
  background-image: url('https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=1920&auto=format&fit=crop'); 
  background-size: cover;
  background-position: center;
  
  /* Critical for fixed full screen without gaps as requested previously */
  position: fixed;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
}

/* Vignetting/Darkening effect to make the card pop */
.login-page::before {
  content: '';
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.4); /* Vignette */
  z-index: 1;
}

/* Centered White Card with Shadow */
.login-card {
  position: relative;
  z-index: 10; /* Card must be above vignette */
  background-color: #ffffff;
  padding: 3rem 2.5rem;
  border-radius: 15px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  text-align: center;
  box-sizing: border-box;
}

/* Logo and Branding Styles */
.logo-container { margin-bottom: 2rem; }
.sprout-icon { 
  color: #2e7d32; /* Primary Green */
  margin-bottom: 10px; 
  display: block;
}

.brand-name { 
  font-size: 1.6rem; 
  color: #333333; 
  margin: 0; 
  font-weight: 600; 
}
.tagline { 
  color: #757575; 
  font-size: 0.95rem; 
  margin-top: 5px; 
}

/* Form Styles */
.login-form { margin-top: 1.5rem; }

/* Input Groups with Absolute Positioning for Icons */
.input-group { 
  position: relative; 
  margin-bottom: 1rem; 
  text-align: left; 
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #2e7d32; /* Green icon color from screenshot */
  font-size: 1rem;
}

.input-group input {
  width: 100%;
  padding: 12px 15px 12px 45px; /* Added left padding for the icon */
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  color: #333333;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.input-group input::placeholder { color: #bdbdbd; }
.input-group input:focus { outline: none; border-color: #2e7d32; }

/* "ACCESS PORTAL" Button */
.access-btn {
  width: 100%;
  padding: 14px;
  background-color: #2e7d32; /* Primary Green */
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

.access-btn:hover { background-color: #1b5e20; }
.access-btn:disabled { background-color: #a5d6a7; cursor: not-allowed; }

/* Footer text replicated exactly from screenshot */
.footer-links { margin-top: 2.5rem; color: #9e9e9e; font-size: 0.8rem; }
.footer-links p { margin: 2px 0; }
</style>