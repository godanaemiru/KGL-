<template>
  <div class="page-container">
    <div class="page-header">
      <h1>Inventory Management</h1>
      <div class="header-actions">
        <input v-model="searchQuery" type="text" class="search-input" placeholder="Search produce, branch, or dealer..." />
        
        <button @click="fetchInventory" class="btn-refresh">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 1 0 2.13-5.88L2 9"/></svg>
          Refresh
        </button>
      </div>
    </div>

    <div class="table-card">
      <h3 class="card-title">Current Stock Levels</h3>
      
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Produce</th>
              <th>Type</th>
              <th>Branch</th>
              <th>Tonnage Available</th>
              <th>Dealer</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredInventory" :key="item._id">
              <td><strong>{{ item.name }}</strong></td>
              <td>{{ item.type }}</td>
              <td><strong>{{ item.branch }}</strong></td>
              <td>{{ item.tonnage.toLocaleString() }} kg</td>
              <td>{{ item.dealerName }}</td>
              <td>
                <span :class="['badge', item.tonnage > 0 ? 'badge-green' : 'badge-red']">
                  {{ item.tonnage > 0 ? 'Available' : 'Out of Stock' }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredInventory.length === 0">
              <td colspan="6" class="text-center">No matching inventory found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../services/api';

const inventory = ref([]);
const searchQuery = ref(''); // Added for search

const fetchInventory = async () => {
  try {
    const res = await api.get('/produce');
    inventory.value = res.data; 
  } catch (err) {
    console.error("Failed to load inventory");
  }
};

// Search Logic: Filters the array instantly as the user types
const filteredInventory = computed(() => {
  if (!searchQuery.value) return inventory.value;
  
  const query = searchQuery.value.toLowerCase();
  return inventory.value.filter(item => {
    return (
      item.name?.toLowerCase().includes(query) ||
      item.branch?.toLowerCase().includes(query) ||
      item.type?.toLowerCase().includes(query) ||
      item.dealerName?.toLowerCase().includes(query)
    );
  });
});

onMounted(fetchInventory);
</script>

<style>
.header-actions { display: flex; gap: 15px; align-items: center; }
.search-input { padding: 10px 15px; border: 1px solid #ccc; border-radius: 6px; width: 280px; font-size: 0.95rem; }
.search-input:focus { outline: none; border-color: #1e6b22; }


.page-container { max-width: 1100px; margin: 0 auto; padding-bottom: 40px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h1 { color: #111; font-size: 1.8rem; margin: 0; font-weight: 700; }

.btn-refresh {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 16px; background-color: #1e6b22; color: white;
  border: none; border-radius: 6px; cursor: pointer; font-weight: 600;
}

.table-card {
  background: white; padding: 25px; border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #eaeaea;
}
.card-title { margin-top: 0; margin-bottom: 20px; color: #111; font-size: 1.1rem; }

.table-responsive { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; text-align: left; }
.data-table th { padding: 12px 15px; color: #666; font-size: 0.85rem; border-bottom: 2px solid #eee; background: #fafafa; }
.data-table td { padding: 15px; border-bottom: 1px solid #eee; color: #333; font-size: 0.95rem; }
.data-table tbody tr:hover { background-color: #fcfcfc; }

.text-center { text-align: center; color: #888; padding: 30px !important; }

/* Status Badges */
.badge { padding: 5px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: bold; }
.badge-green { background: #e6f4ea; color: #1e8e3e; }
.badge-red { background: #fce8e6; color: #d93025; }
</style>