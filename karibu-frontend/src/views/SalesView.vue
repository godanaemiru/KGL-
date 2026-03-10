<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1>Point of Sale</h1>
        <span class="branch-subtitle">Branch: {{ branch }}</span>
      </div>
      
      <div class="date-picker-wrapper">
        <input type="date" ref="datePicker" v-model="form.date" class="hidden-date-picker" :max="todayDate" />
        <button type="button" @click="openDatePicker" class="calendar-btn" title="Change Sale Date">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span class="date-text">{{ formattedDisplayDate }}</span>
        </button>
      </div>
    </div>

    <div class="form-card">
      
      <div class="toggle-container" @click="toggleSaleType" :class="saleType">
        <div class="toggle-switch" :class="{ 'is-credit': saleType === 'credit' }">
          <div class="toggle-knob"></div>
        </div>
        <div class="toggle-text">
          <strong>{{ saleType === 'cash' ? 'Cash Sale' : 'Credit Sale' }}</strong>
          <span class="toggle-desc">
            {{ saleType === 'cash' ? 'Standard transaction (Stock reduced immediately)' : 'Deferred payment for trusted buyers (Stock reduced immediately)' }}
          </span>
        </div>
      </div>

      <form @submit.prevent="submitSale" class="grid-form">
        
        <div class="form-group">
          <label>Select Produce</label>
          <select v-model="selectedProduceIndex" @change="updatePrice" required>
            <option value="null" disabled>-- Choose Item --</option>
            <option v-for="(item, index) in inventory" :key="item._id" :value="index">
              {{ item.name }} (Avail: {{ item.tonnage }}kg)
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Tonnage (kg)</label>
          <input v-model.number="form.tonnage" type="number" min="1" placeholder="e.g. 50" @input="calculateTotal" required />
        </div>

        <div class="form-group">
          <label>{{ saleType === 'cash' ? 'Amount Paid (UgX)' : 'Amount Due (UgX)' }}</label>
          <input :value="calculatedAmount" type="number" class="readonly-input" placeholder="Auto-calculated" disabled />
        </div>

        <div class="form-group">
          <label>Buyer Name</label>
          <input v-model="form.buyerName" type="text" placeholder="Customer Name" minlength="2" required />
        </div>

        <template v-if="saleType === 'credit'">
          <div class="form-group">
            <label>National ID (NIN)</label>
            <input v-model="form.nationalId" type="text" placeholder="e.g. CM1234567890AB" required />
          </div>

          <div class="form-group">
            <label>Location</label>
            <input v-model="form.location" type="text" placeholder="Buyer's Location" minlength="2" required />
          </div>

          <div class="form-group">
            <label>Contacts</label>
            <input v-model="form.contacts" type="text" placeholder="e.g. +256..." required />
          </div>

          <div class="form-group">
            <label>Due Date</label>
            <input v-model="form.dueDate" type="date" required />
          </div>
        </template>

        <div class="form-action">
          <button type="submit" :disabled="loading" class="submit-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; vertical-align: middle;">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            {{ loading ? 'Processing...' : 'Complete Sale' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import api from '../services/api';
import { useToast } from "vue-toastification";

const toast = useToast();
const loading = ref(false);
const saleType = ref('cash'); 
const inventory = ref([]);
const selectedProduceIndex = ref(null);
const unitPrice = ref(0);
const calculatedAmount = ref(0);
const branch = ref(localStorage.getItem('branch') || '');

// Calendar Logic
const datePicker = ref(null);
const todayDate = new Date().toISOString().split('T')[0];

const form = reactive({
  date: todayDate, // New field for backdating
  produceName: '',
  produceType: '',
  tonnage: null,
  amountPaid: 0,
  amountDue: 0,
  buyerName: '',
  salesAgent: localStorage.getItem('username') || 'Agent',
  branch: branch.value,
  nationalId: '',
  location: '',
  contacts: '',
  dueDate: ''
});

const formattedDisplayDate = computed(() => {
  if (form.date === todayDate) return "Today";
  return new Date(form.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
});

const openDatePicker = () => {
  if (datePicker.value && datePicker.value.showPicker) {
    datePicker.value.showPicker();
  }
};

const toggleSaleType = () => {
  saleType.value = saleType.value === 'cash' ? 'credit' : 'cash';
};

const fetchInventory = async () => {
  try {
    const res = await api.get('/produce');
    inventory.value = res.data.filter(item => item.branch === branch.value && item.tonnage > 0);
  } catch (err) { 
    console.error("Failed to load inventory", err); 
  }
};

const updatePrice = () => {
  const selected = inventory.value[selectedProduceIndex.value];
  if (selected) {
    unitPrice.value = selected.sellingPrice;
    form.produceName = selected.name;
    form.produceType = selected.type; 
    calculateTotal();
  }
};

const calculateTotal = () => {
  if (form.tonnage && unitPrice.value) {
    calculatedAmount.value = form.tonnage * unitPrice.value;
  } else {
    calculatedAmount.value = 0;
  }
};

const submitSale = async () => {
  loading.value = true;
  try {
    const endpoint = saleType.value === 'cash' ? '/sales/cash' : '/sales/credit';
    
    if (saleType.value === 'cash') {
      form.amountPaid = calculatedAmount.value;
      form.amountDue = undefined; 
    } else {
      form.amountDue = calculatedAmount.value;
      form.amountPaid = undefined;
    }

    await api.post(endpoint, form);
    toast.success(`🎉 ${saleType.value === 'cash' ? 'Cash' : 'Credit'} Sale Recorded Successfully!`, { timeout: 4000 });
    
    // Reset form
    form.tonnage = null;
    form.buyerName = '';
    form.nationalId = '';
    form.location = '';
    form.contacts = '';
    form.dueDate = '';
    form.date = todayDate; // Reset calendar to today
    calculatedAmount.value = 0;
    selectedProduceIndex.value = "null"; 
    unitPrice.value = 0;
    
    await fetchInventory(); 
  } catch (err) {
    const backendError = err.response?.data?.error || err.response?.data?.message;
    if (err.response?.status === 400 && backendError?.toLowerCase().includes("stock")) {
      toast.error("🚨 OUT OF STOCK: Manager has been notified.", { timeout: 6000 });
    } else if (backendError) {
      toast.error(`❌ Validation Error: ${backendError}`, { timeout: 8000 });
    } else {
      toast.error("❌ Sale failed. Please check your network connection.");
    }
  } finally {
    loading.value = false;
  }
};

onMounted(fetchInventory);
</script>

<style scoped>
.page-container { max-width: 900px; margin: 0 auto; padding-bottom: 40px; }

.page-header { 
  display: flex; justify-content: space-between; align-items: flex-start; 
  margin-bottom: 1.5rem; 
}
.page-header h1 { color: #2c3e50; font-size: 1.8rem; margin: 0 0 5px 0; font-weight: 700; }
.branch-subtitle { color: #7f8c8d; font-size: 0.95rem; }

/* Calendar Styles */
.date-picker-wrapper { position: relative; display: flex; align-items: center; }
.hidden-date-picker { position: absolute; opacity: 0; width: 0; height: 0; pointer-events: none; }
.calendar-btn {
  display: flex; align-items: center; gap: 8px; background: #eef7ee;
  border: 1px solid #c8e6c9; border-radius: 8px; padding: 10px 15px;
  cursor: pointer; color: #1e6b22; font-weight: 600; font-size: 0.95rem; transition: all 0.2s ease;
}
.calendar-btn:hover { background: #e8f5e9; transform: translateY(-2px); box-shadow: 0 4px 6px rgba(0,0,0,0.05); }

.form-card {
  background: white; padding: 2.5rem; border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #eaeaea;
}

/* Toggle Switch Styling */
.toggle-container {
  padding: 15px 20px; border-radius: 8px;
  display: flex; align-items: center; gap: 15px; margin-bottom: 25px;
  cursor: pointer; transition: all 0.3s ease;
  background: #eef7ee; border: 1px solid #d4ebd4; 
}
.toggle-container.credit { background: #fdf5e6; border: 1px solid #fae5b6; }

.toggle-switch {
  width: 50px; height: 26px; background: #bdc3c7; 
  border-radius: 13px; position: relative; transition: 0.3s;
}
.toggle-switch.is-credit { background: #f39c12; }
.toggle-switch:not(.is-credit) { background: #1e6b22; }

.toggle-knob {
  width: 22px; height: 22px; background: white; border-radius: 50%;
  position: absolute; top: 2px; left: 2px;
  transition: 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
.toggle-switch.is-credit .toggle-knob { transform: translateX(24px); }

.toggle-text { display: flex; flex-direction: column; }
.toggle-text strong { font-size: 1.05rem; color: #2c3e50; }
.toggle-desc { font-size: 0.8rem; color: #7f8c8d; margin-top: 2px; }

/* Form Grid */
.grid-form { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label { font-size: 0.85rem; color: #555; font-weight: 600; }
.form-group input, .form-group select {
  padding: 12px 15px; border: 1px solid #ccc; border-radius: 6px; font-size: 1rem; color: #333;
}
.form-group input:focus, .form-group select:focus { outline: none; border-color: #1e6b22; }

.readonly-input { background-color: #f8f9fa; color: #7f8c8d !important; cursor: not-allowed; font-weight: bold; }

.form-action { grid-column: 1 / -1; margin-top: 15px; }
.submit-btn {
  width: 100%; padding: 15px; background-color: #1e6b22; color: white;
  border: none; border-radius: 6px; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: 0.2s;
  display: flex; justify-content: center; align-items: center;
}
.submit-btn:hover { background-color: #154c18; }
.submit-btn:disabled { background-color: #95a5a6; cursor: not-allowed; }
</style>