<template>
  <div class="page-container">
    <div class="page-header">
      <h1>Director Command Center</h1>
      <span class="date">{{ currentDate }}</span>
    </div>

    <div v-if="loading" class="loader">Analyzing Financials...</div>
    <div v-if="loading" class="loader">Analyzing Financials...</div>
    <div v-else class="metrics-grid">
      <div class="metric-card border-green card-hover">
        <div class="card-content">
          <span class="metric-title">Total Cash Revenue</span>
          <h2 class="metric-value">UgX {{ totals.cashRevenue?.toLocaleString() }}</h2>
        </div>
        <svg class="watermark" viewBox="0 0 24 24" fill="none" stroke="#1e6b22"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      </div>

      <div class="metric-card border-yellow card-hover">
        <div class="card-content">
          <span class="metric-title">Outstanding Credit</span>
          <h2 class="metric-value">UgX {{ totals.outstandingCredit?.toLocaleString() }}</h2>
        </div>
        <svg class="watermark" viewBox="0 0 24 24" fill="none" stroke="#f1c40f"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
      </div>

      <div class="metric-card border-orange card-hover">
        <div class="card-content">
          <span class="metric-title">Stocked Items</span>
          <h2 class="metric-value">{{ inventory.length }}</h2>
        </div>
        <svg class="watermark" viewBox="0 0 24 24" fill="none" stroke="#e67e22"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
      </div>
    </div>

    <div class="charts-grid">
      <div class="chart-card">
        <h3>Revenue Composition</h3>
        <div class="chart-wrapper">
          <canvas id="revenueChart"></canvas>
        </div>
      </div>

      <div class="chart-card">
        <h3>Stock Levels (kg)</h3>
        <div class="chart-wrapper">
          <canvas id="inventoryChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import api from '../services/api';
import Chart from 'chart.js/auto';

const totals = ref({ cashRevenue: 0, outstandingCredit: 0 });
const inventory = ref([]);
const loading = ref(true);
const currentDate = new Date().toDateString();

const fetchData = async () => {
  try {
    // 1. Fetch Totals Safely
    try {
      const totalsRes = await api.get('/reports/totals');
      totals.value = totalsRes.data;
    } catch (err) {
      console.error("Blocked from fetching totals:", err.response?.data || err.message);
      // Optional: use toast.error("Failed to load revenue data") here
    }

    // 2. Fetch Inventory Safely
    try {
      const inventoryRes = await api.get('/produce');
      inventory.value = inventoryRes.data;
    } catch (err) {
      console.error("Blocked from fetching inventory:", err.response?.data || err.message);
    }
    
    // 3. Render charts regardless of whether data is empty or full
    await nextTick();
    renderCharts();
    
  } finally {
    loading.value = false;
  }
};
const renderCharts = () => {
  // 1. Revenue Pie Chart (Upgraded tooltips & spacing)
  new Chart(document.getElementById('revenueChart'), {
    type: 'doughnut',
    data: {
      labels: ['Cash Revenue', 'Outstanding Credit'],
      datasets: [{
        data: [totals.value.cashRevenue, totals.value.outstandingCredit],
        backgroundColor: ['#1e6b22', '#f1c40f'],
        borderWidth: 3, // Adds a nice gap between segments
        borderColor: '#ffffff',
        hoverOffset: 8 // Makes the segment pop out when hovering!
      }]
    },
    options: { 
      cutout: '75%', 
      plugins: { 
        legend: { position: 'bottom', labels: { padding: 20, font: { family: "'Segoe UI', sans-serif" } } } 
      } 
    }
  });

  // 2. Inventory Bar Chart (SMART COLORS)
  new Chart(document.getElementById('inventoryChart'), {
    type: 'bar',
    data: {
      // Show branch name in label to prevent duplicates like "Maize Grain" twice
      labels: inventory.value.map(item => `${item.name} (${item.branch})`),
      datasets: [{
        label: 'Kilograms (kg)',
        data: inventory.value.map(item => item.tonnage),
        // THE MAGIC: If tonnage < 500, make it RED. Otherwise, Green.
        backgroundColor: inventory.value.map(item => item.tonnage < 500 ? '#e74c3c' : '#1e6b22'),
        borderRadius: { topLeft: 6, topRight: 6 }, // Sleek rounded tops
        borderWidth: 0
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { 
        y: { beginAtZero: true, grid: { color: '#f0f0f0' } },
        x: { grid: { display: false } } // Hide vertical grid lines for a cleaner look
      }
    }
  });
};

onMounted(fetchData);
</script>

<style scoped>
.page-container { max-width: 1100px; margin: 0 auto; padding-bottom: 50px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.page-header h1 { font-size: 2rem; font-weight: 700; color: #111; }
.date { color: #888; }

.metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
.metric-card {
  background: white; padding: 25px; border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-left: 6px solid #ccc;
}
.border-green { border-left-color: #1e6b22; }
.border-yellow { border-left-color: #f1c40f; }
.border-orange { border-left-color: #e67e22; }

.metric-title { color: #666; font-size: 0.9rem; font-weight: 600; display: block; margin-bottom: 8px; }
.metric-value { font-size: 1.6rem; font-weight: 800; color: #111; margin: 0; }

/* Charts Layout */
.charts-grid { display: grid; grid-template-columns: 400px 1fr; gap: 25px; }
.chart-card {
  background: white; padding: 25px; border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #eaeaea;
}
.chart-card h3 { font-size: 1rem; margin-bottom: 20px; color: #333; }
.chart-wrapper { position: relative; height: 300px; }

.loader { text-align: center; padding: 50px; color: #1e6b22; font-weight: bold; }


/* Card Hover Dynamics */
.card-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden; /* Keeps the watermark inside the card */
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

/* Watermark Icons */
.watermark {
  position: absolute;
  right: -10px;
  bottom: -20px;
  width: 120px;
  height: 120px;
  opacity: 0.08; /* Very faint! */
  transform: rotate(-15deg);
  pointer-events: none;
}

/* Ensure text stays above the watermark */
.card-content {
  position: relative;
  z-index: 2;
}
</style>