<template>
  <div class="page-container">
    <div class="page-header">
      <h1>Staff Directory</h1>
      <button @click="fetchUsers" class="btn-refresh">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 1 0 2.13-5.88L2 9"/></svg>
        Refresh
      </button>
    </div>

    <div class="table-card">
      <div v-if="loading" class="loader">Loading staff data...</div>
      
      <div v-else class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Branch</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user._id">
              <td><strong>{{ user.username }}</strong></td>
              <td>
                <span :class="['role-badge', roleClass(user.role)]">
                  {{ formatRole(user.role) }}
                </span>
              </td>
              <td>{{ user.branch === 'All' ? 'Headquarters' : user.branch }}</td>
              <td>
                <span class="status-active">
                  <span class="dot"></span> Active
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const users = ref([]);
const loading = ref(true);

const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await api.get('/users');
    users.value = res.data;
  } catch (err) {
    console.error("Failed to load users");
  } finally {
    loading.value = false;
  }
};

const formatRole = (role) => {
  if (role === 'sales_agent') return 'AGENT';
  return role.toUpperCase();
};

const roleClass = (role) => {
  if (role === 'manager') return 'badge-manager';
  if (role === 'sales_agent') return 'badge-agent';
  return 'badge-director';
};

onMounted(fetchUsers);
</script>

<style scoped>
/* Inherit standard layout classes */
.table-card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
.data-table { width: 100%; border-collapse: collapse; text-align: left; }
.data-table th { padding: 15px; border-bottom: 2px solid #eee; color: #666; font-size: 0.9rem; }
.data-table td { padding: 15px; border-bottom: 1px solid #eee; color: #333; }

/* Role Badges matching your screenshot */
.role-badge { padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.5px; }
.badge-manager { background: #e3f2fd; color: #1976d2; }
.badge-agent { background: #fff3e0; color: #f57c00; }
.badge-director { background: #f5f5f5; color: #424242; }

/* Active Status indicator */
.status-active { color: #1e8e3e; font-weight: 600; font-size: 0.9rem; display: flex; align-items: center; gap: 6px; }
.dot { width: 8px; height: 8px; background-color: #1e8e3e; border-radius: 50%; display: inline-block; }

.btn-refresh { display: flex; align-items: center; gap: 8px; padding: 8px 16px; background-color: #1e6b22; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
</style>