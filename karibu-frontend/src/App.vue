<template>
  <div id="app" :class="{ 'app-layout': isLoggedIn, 'login-layout': !isLoggedIn }">
    
    <aside v-if="isLoggedIn" class="sidebar">
      <div class="sidebar-header">
        <svg class="logo-icon" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 14 5.25 9 6.25C4 7.25 2 11.5 2 13.5C2 15.5 3.75 17.25 3.75 17.25C7 8 17 8 17 8Z"/>
        </svg>
        <div class="brand-text">
          <span class="brand-karibu">Karibu</span>
          <span class="brand-role">{{ roleDisplay }}</span>
        </div>
      </div>

      <nav class="sidebar-nav">
  <template v-if="role === 'director'">
    <div class="nav-label">Management</div>
    <router-link to="/dashboard" class="nav-item">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
      Overview
    </router-link>
    
    <div class="nav-label">Analytics</div>
    <router-link to="/sales-reports" class="nav-item">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
      Sales Reports
    </router-link>
    <router-link to="/inventory-list" class="nav-item">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
      Stock Status
    </router-link>
    <router-link to="/staff" class="nav-item">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
    Staff & Users
  </router-link>
  </template>

  <template v-if="role === 'manager'">
    <router-link to="/inventory" class="nav-item">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
      Procurement
    </router-link>
    <router-link to="/inventory-list" class="nav-item">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
      Check Stock
    </router-link>
  </template>

  <router-link v-if="role === 'manager' || role === 'sales_agent'" to="/sales" class="nav-item">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
    Sales Portal
  </router-link>
</nav>

      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-avatar">
            {{ username.charAt(0).toUpperCase() }}
          </div>
          <div class="user-details">
            <span class="user-name">{{ username }}</span>
            <span class="user-branch" v-if="branch !== 'All'">Branch: {{ branch }}</span>
          </div>
        </div>
        <button @click="logout" class="logout-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 5px;"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Logout
        </button>
      </div>
    </aside>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const isLoggedIn = ref(false);
const role = ref('');
const branch = ref('');
const username = ref('');

watch(() => route.path, () => {
  const token = localStorage.getItem('token');
  isLoggedIn.value = !!token;
  role.value = localStorage.getItem('role') || '';
  branch.value = localStorage.getItem('branch') || '';
  username.value = localStorage.getItem('username') || 'User';
}, { immediate: true });

const roleDisplay = computed(() => {
  if (role.value === 'director') return 'Director';
  if (role.value === 'manager') return 'Manager';
  return 'Sales Agent';
});

const logout = () => {
  localStorage.clear();
  isLoggedIn.value = false;
  router.push('/');
};
</script>

<style>
/* Global Resets - Ensures no weird margins */
body, html { margin: 0; padding: 0; background-color: #f4f7f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; overflow-x: hidden; }

/* Layout Grid - THE WIDTH FIX IS HERE */
.app-layout {
  display: flex;
  height: 100vh;
  width: 100vw; /* Forces the app to stretch edge-to-edge */
  overflow: hidden;
}

.login-layout { display: block; }

/* Sidebar Styles */
.sidebar {
  width: 260px;
  min-width: 260px; /* Prevents sidebar from shrinking */
  background-color: #1e6b22; 
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 10px rgba(0,0,0,0.1);
  z-index: 10;
}

.sidebar-header {
  padding: 2rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-icon { color: #f1c40f; }
.brand-text { display: flex; flex-direction: column; }
.brand-karibu { font-weight: 800; font-size: 1.2rem; color: #f1c40f; }
.brand-role { font-size: 0.9rem; opacity: 0.9; }

.sidebar-nav {
  flex-grow: 1;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  color: white;
  text-decoration: none;
  padding: 12px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 15px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-item:hover, .router-link-active {
  background-color: rgba(255, 255, 255, 0.15);
  color: #f1c40f;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.user-avatar {
  width: 40px; height: 40px;
  background: #f1c40f; color: #1e6b22;
  border-radius: 50%; display: flex;
  align-items: center; justify-content: center;
  font-weight: bold; font-size: 1.2rem;
}

.user-details { display: flex; flex-direction: column; }
.user-name { font-weight: bold; font-size: 0.95rem; }
.user-branch { font-size: 0.75rem; opacity: 0.8; }

.logout-btn {
  width: 100%; padding: 10px;
  background: transparent; color: #f1c40f;
  border: 1px solid #f1c40f; border-radius: 6px;
  cursor: pointer; font-weight: 600;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s ease;
}

.logout-btn:hover { background: #f1c40f; color: #1e6b22; }

/* Main Content Wrapper - Takes up remaining space */
.main-content {
  flex-grow: 1;
  width: calc(100vw - 260px); /* Calculates exactly the space left */
  padding: 2rem 3rem;
  overflow-y: auto;
  background-color: #f8f9fa;
  box-sizing: border-box;
}
</style>