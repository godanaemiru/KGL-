// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import ProcurementView from "../views/ProcurementView.vue";
import SalesView from "../views/SalesView.vue";
import DirectorDashboard from "../views/DirectorDashboard.vue";
import InventoryListView from "../views/InventoryListView.vue";
import SalesReportsView from "../views/SalesReportsView.vue";
import StaffDirectoryView from "../views/StaffDirectoryView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: LoginView },
    { path: "/inventory", component: ProcurementView },
    { path: "/sales", component: SalesView },
    {
      path: "/dashboard",
      component: DirectorDashboard,
      beforeEnter: (to, from, next) => {
        const role = localStorage.getItem("role");
        if (role === "director") next();
        else {
          alert("Access Denied: Director only area.");
          next("/");
        }
      },
    },
    { path: "/inventory-list", component: InventoryListView },
    { path: "/sales-reports", component: SalesReportsView },
    {
      path: "/staff",
      component: StaffDirectoryView,
      meta: { requiresAuth: true, roles: ["director"] },
    },
  ],
});

export default router;
