const Sale = require('../models/Sale');
const CreditSale = require('../models/CreditSale');
const Produce = require('../models/Produce');

// Record a Cash Sale
exports.recordCashSale = async (req, res) => {
  const { produceName, branch, tonnage } = req.body;

  try {
    // 1. Find the specific produce in the specific branch
    const produce = await Produce.findOne({ name: produceName, branch: branch });

    // 2. Check if it exists and if there is enough stock
    if (!produce || produce.tonnage < tonnage) {
      return res.status(400).json({ 
        message: 'Insufficient stock or out of stock. Manager has been notified.' 
      }); 
    }

    // 3. Reduce the tonnage of the produce
    produce.tonnage -= tonnage;
    await produce.save();

    // 4. Record the sale
    const newSale = new Sale(req.body);
    await newSale.save();

    res.status(201).json({ message: 'Cash sale recorded successfully', sale: newSale });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Record a Credit Sale
exports.recordCreditSale = async (req, res) => {
  const { produceName, branch, tonnage } = req.body; // Assuming branch is sent in the request to locate the right stock

  try {
    const produce = await Produce.findOne({ name: produceName, branch: branch });

    if (!produce || produce.tonnage < tonnage) {
      return res.status(400).json({ 
        message: 'Insufficient stock or out of stock. Manager has been notified.' 
      });
    }

    produce.tonnage -= tonnage;
    await produce.save();

    const newCreditSale = new CreditSale(req.body);
    await newCreditSale.save();

    res.status(201).json({ message: 'Credit sale recorded successfully', creditSale: newCreditSale });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getAggregatedTotals = async (req, res) => {
  try {
    // 1. Sum up all Cash Sales
    const totalCashSales = await Sale.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$amountPaid" } } }
    ]);

    // 2. Sum up all Credit Sales
    const totalCreditDue = await CreditSale.aggregate([
      { $group: { _id: null, totalDue: { $sum: "$amountDue" } } }
    ]);

    res.status(200).json({
      title: "Karibu Groceries Business Overview",
      cashRevenue: totalCashSales[0]?.totalRevenue || 0,
      outstandingCredit: totalCreditDue[0]?.totalDue || 0,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch all sales (Cash and Credit) for the reports table
exports.getAllSales = async (req, res) => {
  try {
    // Fetch both collections using lean() for faster read-only queries
    const cashSales = await Sale.find().sort({ createdAt: -1 }).lean();
    const creditSales = await CreditSale.find().sort({ createdAt: -1 }).lean();

    // Map them to have consistent field names for the frontend table
    const formattedCash = cashSales.map(sale => ({
      ...sale,
      transactionType: 'Cash',
      amount: sale.amountPaid,
      date: sale.createdAt
    }));

    const formattedCredit = creditSales.map(sale => ({
      ...sale,
      transactionType: 'Credit',
      amount: sale.amountDue,
      date: sale.createdAt
    }));

    // Combine and sort by date descending (newest first)
    const allTransactions = [...formattedCash, ...formattedCredit].sort((a, b) => b.date - a.date);

    res.status(200).json(allTransactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};