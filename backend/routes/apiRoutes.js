const express = require('express');
const router = express.Router();
const produceController = require('../controllers/produceController');
const saleController = require('../controllers/saleController');

// Produce Routes
router.post('/produce', produceController.addProduce);
router.get('/produce', produceController.getProduce);

// Sales Routes
router.post('/sales/cash', saleController.recordCashSale);
router.post('/sales/credit', saleController.recordCreditSale);

module.exports = router;