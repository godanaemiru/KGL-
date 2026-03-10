const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Produce = require('../models/Produce');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // 2. Clear existing data to avoid duplicates
    await User.deleteMany({});
    await Produce.deleteMany({});
    console.log("Cleared old Users and Produce records.");

    // 3. Create Users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
      // Directors
      { username: 'director_orban', password: hashedPassword, role: 'director', branch: 'All' },
      
      // Managers for Maganjo (2)
      { username: 'manager_maganjo_1', password: hashedPassword, role: 'manager', branch: 'Maganjo' },
      { username: 'manager_maganjo_2', password: hashedPassword, role: 'manager', branch: 'Maganjo' },
      
      // Managers for Matugga (2)
      { username: 'manager_matugga_1', password: hashedPassword, role: 'manager', branch: 'Matugga' },
      { username: 'manager_matugga_2', password: hashedPassword, role: 'manager', branch: 'Matugga' },
      
      // Sales Agents
      { username: 'agent_maganjo', password: hashedPassword, role: 'sales_agent', branch: 'Maganjo' },
      { username: 'agent_matugga', password: hashedPassword, role: 'sales_agent', branch: 'Matugga' }
    ];

    await User.insertMany(users);
    console.log("✅ Users seeded (1 Director, 4 Managers, 2 Agents)");

    // 4. Populate Initial Stock (Produce)
    // We'll add high tonnage items to make the charts look good
    const initialStock = [
      // Maganjo Branch Stock
      { 
        name: 'Maize Grain', type: 'Longe 5', tonnage: 5000, 
        cost: 4500000, dealerName: 'Agro Uganda Ltd', 
        branch: 'Maganjo', contact: '0701000000', sellingPrice: 1200 
      },
      { 
        name: 'Beans', type: 'Yellow', tonnage: 3500, 
        cost: 7000000, dealerName: 'Maganjo Farmers Co', 
        branch: 'Maganjo', contact: '0702000000', sellingPrice: 2500 
      },
      { 
        name: 'Soya Beans', type: 'Standard', tonnage: 1200, 
        cost: 3000000, dealerName: 'Central Suppliers', 
        branch: 'Maganjo', contact: '0703000000', sellingPrice: 3200 
      },

      // Matugga Branch Stock
      { 
        name: 'Maize Grain', type: 'Longe 5', tonnage: 4200, 
        cost: 3800000, dealerName: 'Northern Grains', 
        branch: 'Matugga', contact: '0704000000', sellingPrice: 1200 
      },
      { 
        name: 'Cow Peas', type: 'Local', tonnage: 2800, 
        cost: 4000000, dealerName: 'Matugga Seed Hub', 
        branch: 'Matugga', contact: '0705000000', sellingPrice: 1800 
      },
      { 
        name: 'Ground Nuts', type: 'Red Beauty', tonnage: 450, // Note: This will trigger low stock alerts!
        cost: 2000000, dealerName: 'Eastern Nut Co', 
        branch: 'Matugga', contact: '0706000000', sellingPrice: 4500 
      }
    ];

    await Produce.insertMany(initialStock);
    console.log("✅ Inventory seeded with variety of produce across both branches.");

    console.log("--- SEEDING COMPLETE ---");
    process.exit();
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedDatabase();