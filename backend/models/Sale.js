const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  produceName: { type: String, required: true }, // [cite: 15]
  tonnage: { type: Number, required: true }, // [cite: 15]
  amountPaid: { 
    type: Number, 
    required: true, 
    min: [10000, 'Amount must be at least 5 digits'] 
  }, // [cite: 15]
  buyerName: { 
    type: String, 
    required: true, 
    minlength: 2, 
    match: /^[a-zA-Z0-9 ]+$/ 
  }, // [cite: 15]
  salesAgent: { 
    type: String, 
    required: true, 
    minlength: 2, 
    match: /^[a-zA-Z0-9_ ]+$/ 
  }, // [cite: 15]
  branch: { 
    type: String, 
    required: true, 
    enum: ['Maganjo', 'Matugga'] 
  },
  date: { 
    type: Date, 
    default: Date.now // Falls back to current time if none is provided
  },
}, { timestamps: true }); // handles date and time automatically [cite: 15]

module.exports = mongoose.model('Sale', saleSchema);