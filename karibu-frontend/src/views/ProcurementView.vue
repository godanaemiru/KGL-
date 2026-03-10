<template>
  <div class="page-container">
    <div class="page-header">
      <h1>Procure Produce (Stock In)</h1>
    </div>

    <div class="form-card">
      <h3 class="form-title"> New Stock Entry</h3>
      
      <form @submit.prevent="submitProcurement" class="grid-form">
        <div class="form-group">
          <label>Produce Name</label>
          <input v-model="form.name" type="text" placeholder="e.g. Grain Maize" required />
        </div>
        
        <div class="form-group">
          <label>Tonnage (kg)</label>
          <input v-model.number="form.tonnage" type="number" min="100" placeholder="Min 100" required />
        </div>

        <div class="form-group">
          <label>Dealer Name</label>
          <input v-model="form.dealerName" type="text" placeholder="Supplier Name" required />
        </div>

        <div class="form-group">
          <label>Selling Price (per kg)</label>
          <input v-model.number="form.sellingPrice" type="number" placeholder="Unit Price" required />
        </div>

        <div class="form-group">
          <label>Type (Variety)</label>
          <input v-model="form.type" type="text" placeholder="e.g. Yellow Dent" required />
        </div>

        <div class="form-group">
          <label>Total Cost (UgX)</label>
          <input v-model.number="form.cost" type="number" min="10000" placeholder="Min 10,000" required />
        </div>

        <div class="form-group">
          <label>Dealer Contact</label>
          <input v-model="form.contact" type="text" placeholder="07..." required />
        </div>

        <div class="form-group">
          <label>Target Branch</label>
          <select v-model="form.branch" required>
            <option value="Maganjo">Maganjo</option>
            <option value="Matugga">Matugga</option>
          </select>
        </div>

        <div class="form-action">
          <button type="submit" :disabled="loading" class="submit-btn">
            {{ loading ? 'Saving...' : 'Record Procurement' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// Use the exact same script setup from your previous ProcurementView.vue!
import { ref, reactive } from 'vue';
import api from '../services/api';
import { useToast } from "vue-toastification";

const toast = useToast();
const loading = ref(false);

const form = reactive({
  name: '', type: '', date: new Date().toISOString().split('T')[0],
  tonnage: null, cost: null, dealerName: '', branch: 'Maganjo', contact: '', sellingPrice: null
});

const submitProcurement = async () => {
  loading.value = true;
  try {
    await api.post('/produce', form);
    toast.success("Procurement recorded successfully!");
    Object.assign(form, { name: '', type: '', tonnage: null, cost: null, dealerName: '', contact: '', sellingPrice: null });
  } catch (err) {
    toast.error(err.response?.data?.error || "Error recording stock.");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.page-container { max-width: 900px; margin: 0 auto; }
.page-header h1 { color: #333; font-size: 1.8rem; margin-bottom: 1.5rem; }

.form-card {
  background: white; padding: 2.5rem; border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #eaeaea;
}

.form-title { color: #1e6b22; font-size: 1.2rem; margin-bottom: 2rem; display: flex; align-items: center; gap: 8px; }

.grid-form { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label { font-size: 0.85rem; color: #555; font-weight: 600; }
.form-group input, .form-group select {
  padding: 12px 15px; border: 1px solid #ccc; border-radius: 6px; font-size: 1rem;
}
.form-group input:focus, .form-group select:focus { outline: none; border-color: #1e6b22; }

.form-action { grid-column: 1 / -1; margin-top: 10px; }
.submit-btn {
  width: 100%; padding: 15px; background-color: #1e6b22; color: white;
  border: none; border-radius: 6px; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: 0.2s;
}
.submit-btn:hover { background-color: #154c18; }
</style>