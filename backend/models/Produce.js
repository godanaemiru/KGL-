const mongoose = require('mongoose');

const produceSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    match: [/^[a-zA-Z0-9 ]+$/, 'Only alphanumeric characters allowed'] 
  }, // 
  type: { 
    type: String, 
    required: true, 
    minlength: 2, 
    match: [/^[a-zA-Z0-9 ]+$/, 'Only alphanumeric characters and spaces allowed']
  }, // 
  date: { 
    type: Date, 
    required: true, 
    default: Date.now 
  }, // 
  tonnage: { 
    type: Number, 
    required: true, 
    min: [0, 'Tonnage cannot be negative'] 
  }, // 
  cost: { 
    type: Number, 
    required: true, 
    min: [10000, 'Cost must be at least 5 digits (10000+)'] 
  }, // 
  dealerName: { 
    type: String, 
    required: true, 
    minlength: 2, 
    match: [/^[a-zA-Z0-9 ]+$/, 'Only alphanumeric characters allowed'] 
  }, // 
  branch: { 
    type: String, 
    required: true, 
    enum: ['Maganjo', 'Matugga'] 
  }, // [cite: 9, 12]
  contact: { 
    type: String, 
    required: true, 
    match: [/^\+?[0-9]{10,14}$/, 'Please enter a valid phone number'] 
  }, // 
  sellingPrice: { 
    type: Number, 
    required: true 
  } // 
}, { timestamps: true });

module.exports = mongoose.model('Produce', produceSchema);