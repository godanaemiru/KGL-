<template>
  <div class="page-container">
    <div class="page-header">
      <h1>Sales Reports</h1>
      <button @click="printReport" class="btn-outline">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
        Print Report
      </button>
    </div>

    <div class="table-card">
      <div class="table-toolbar">
        <h3 class="card-title">All Transactions</h3>
        <input v-model="searchQuery" type="text" class="search-input" placeholder="Search buyer, produce, or agent..." />
      </div>
      
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Branch</th>
              <th>Produce</th>
              <th>Buyer</th>
              <th>Agent</th>
              <th>Amount (UgX)</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in filteredSales" :key="sale._id">
              <td>{{ new Date(sale.date).toLocaleDateString() }}</td>
              <td><strong>{{ sale.branch }}</strong></td>
              <td>{{ sale.produceName }}</td>
              <td>{{ sale.buyerName }}</td>
              <td>{{ sale.salesAgent }}</td>
              <td>{{ sale.amount?.toLocaleString() }}</td>
              <td>
                <span :class="['badge', sale.transactionType === 'Cash' ? 'badge-green' : 'badge-orange']">
                  {{ sale.transactionType }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredSales.length === 0">
              <td colspan="7" class="text-center">No transactions match your search.</td>
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

const sales = ref([]);
const searchQuery = ref('');

const fetchSales = async () => {
  try {
    const res = await api.get('/sales');
    sales.value = res.data;
  } catch (err) {
    console.error("Failed to load sales data");
  }
};

// Search Filter Logic
const filteredSales = computed(() => {
  if (!searchQuery.value) return sales.value;
  
  const lowerCaseQuery = searchQuery.value.toLowerCase();
  return sales.value.filter(sale => {
    return (
      sale.buyerName?.toLowerCase().includes(lowerCaseQuery) ||
      sale.produceName?.toLowerCase().includes(lowerCaseQuery) ||
      sale.salesAgent?.toLowerCase().includes(lowerCaseQuery)
    );
  });
});

// Triggers the browser's native print dialog
const printReport = () => {
  window.print();
};

onMounted(fetchSales);
</script>

<style scoped>
/* Inherits .page-container and .data-table from the global styles we set above */
.table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.table-toolbar .card-title { margin: 0; }

.search-input {
  padding: 10px 15px; border: 1px solid #ddd; border-radius: 6px; width: 280px; font-size: 0.9rem;
}
.search-input:focus { outline: none; border-color: #1e6b22; }

.btn-outline {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 16px; background-color: white; color: #1e6b22;
  border: 1px solid #1e6b22; border-radius: 6px; cursor: pointer; font-weight: 600; transition: 0.2s;
}
.btn-outline:hover { background-color: #f4fdf5; }

.badge-orange { background: #fef0db; color: #e67e22; }

/* CSS to hide sidebar and search bar when Printing */
@media print {
  .search-input, .btn-outline { display: none !important; }
  .table-card { box-shadow: none; border: none; }
}
</style>