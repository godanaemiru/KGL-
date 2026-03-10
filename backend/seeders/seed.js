const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import your models
const User = require('../models/User');
const Produce = require('../models/Produce');
const Sale = require('../models/Sale');
const CreditSale = require('../models/CreditSale');

const seedDatabase = async () => {
  try {
    // 1. Connect to MongoDB (works for local or live Atlas URI)
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🔌 Connected to MongoDB for seeding...");

    // 2. Wipe the slate clean to prevent duplicates
    await User.deleteMany({});
    await Produce.deleteMany({});
    await Sale.deleteMany({});
    await CreditSale.deleteMany({});
    console.log("🧹 Cleared old database records.");

    // 3. Create Users
    const defaultPassword = await bcrypt.hash('password123', 10);

    const users = [
      { username: 'director_orban', password: defaultPassword, role: 'director', branch: 'All' },
      { username: 'manager_maganjo', password: defaultPassword, role: 'manager', branch: 'Maganjo' },
      { username: 'manager_matugga', password: defaultPassword, role: 'manager', branch: 'Matugga' },
      { username: 'agent_maganjo', password: defaultPassword, role: 'sales_agent', branch: 'Maganjo' },
      { username: 'agent_matugga', password: defaultPassword, role: 'sales_agent', branch: 'Matugga' }
    ];

    await User.insertMany(users);
    console.log("✅ Users seeded successfully.");

    // 4. Create Initial Stock
    const inventory = [
      // Maganjo Stock
      { name: 'Maize Grain', type: 'Longe 5', tonnage: 4500, cost: 4500000, dealerName: 'Agro Uganda', branch: 'Maganjo', contact: '0701000000', sellingPrice: 1200 },
      { name: 'Beans', type: 'Yellow', tonnage: 3200, cost: 6000000, dealerName: 'Maganjo Farmers', branch: 'Maganjo', contact: '0702000000', sellingPrice: 2500 },
      { name: 'Soya Beans', type: 'Standard', tonnage: 450, cost: 1200000, dealerName: 'Central Suppliers', branch: 'Maganjo', contact: '0703000000', sellingPrice: 3200 }, // 450kg triggers the RED low-stock warning!

      // Matugga Stock
      { name: 'Cow Peas', type: 'Local', tonnage: 2800, cost: 4000000, dealerName: 'Matugga Seed Hub', branch: 'Matugga', contact: '0705000000', sellingPrice: 1800 },
      { name: 'Ground Nuts', type: 'Red Beauty', tonnage: 1500, cost: 5000000, dealerName: 'Eastern Nut Co', branch: 'Matugga', contact: '0706000000', sellingPrice: 4500 }
    ];

    await Produce.insertMany(inventory);
    console.log("✅ Inventory seeded successfully.");

    // 5. Create Sample Sales (To populate the Director's Charts)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const cashSales = [
      { produceName: 'Maize Grain', produceType: 'Longe 5', tonnage: 200, amountPaid: 240000, buyerName: 'Kato Paul', salesAgent: 'agent_maganjo', branch: 'Maganjo', date: new Date() },
      { produceName: 'Beans', produceType: 'Yellow', tonnage: 100, amountPaid: 250000, buyerName: 'Mukasa John', salesAgent: 'agent_maganjo', branch: 'Maganjo', date: yesterday }
    ];

    const creditSales = [
      { produceName: 'Ground Nuts', produceType: 'Red Beauty', tonnage: 50, amountDue: 225000, buyerName: 'Nassali Mary', nationalId: 'CM1234567890AB', location: 'Matugga Town', contacts: '0771234567', dueDate: new Date(new Date().setDate(new Date().getDate() + 14)), salesAgent: 'agent_matugga', branch: 'Matugga', date: new Date() }
    ];

    await Sale.insertMany(cashSales);
    await CreditSale.insertMany(creditSales);
    console.log("✅ Sample Cash & Credit Sales seeded successfully.");

    console.log("🎉 --- SEEDING COMPLETE --- 🎉");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seedDatabase();