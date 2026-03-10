const express = require('express');
const router = express.Router();
const produceController = require('../controllers/produceController');
const saleController = require('../controllers/saleController');
const authController = require('../controllers/authController');
const { authorize } = require('../middleware/auth');

// Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Produce Routes: Only Manager can record produce 
router.post('/produce', authorize(['manager']), produceController.addProduce);
router.get('/produce', authorize(['manager', 'sales_agent','director']), produceController.getProduce);

// Sales Routes: Both Sales Agents and Managers can record sales [cite: 14, 24]
router.post('/sales/cash', authorize(['manager', 'sales_agent']), saleController.recordCashSale);
router.post('/sales/credit', authorize(['manager', 'sales_agent']), saleController.recordCreditSale);
router.get('/sales', authorize(['manager', 'director']), saleController.getAllSales);

// Director Route: Only Mr. Orban can see aggregations 
router.get('/reports/totals', authorize(['director']), saleController.getAggregatedTotals);

//user route
router.get('/users', authorize(['director']), authController.getAllUsers);

module.exports = router;