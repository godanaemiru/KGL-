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