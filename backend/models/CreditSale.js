const mongoose = require('mongoose');

const creditSaleSchema = new mongoose.Schema({
  buyerName: { 
    type: String, 
    required: true, 
    minlength: 2, 
    match: /^[a-zA-Z0-9 ]+$/ 
  }, // [cite: 18]
  nationalId: { 
    type: String, 
    required: true, 
    match: [/^[A-Z0-9]{13,14}$/, 'Valid NIN format required'] 
  }, // [cite: 18]
  location: { 
    type: String, 
    required: true, 
    minlength: 2, 
    match: /^[a-zA-Z0-9 ]+$/ 
  }, // [cite: 18]
  contacts: { 
    type: String, 
    required: true, 
    match: /^\+?[0-9]{10,14}$/ 
  }, // [cite: 18]
  amountDue: { 
    type: Number, 
    required: true, 
    min: 10000 
  }, // [cite: 18]
  salesAgent: { 
    type: String, 
    required: true, 
    minlength: 2, 
    match: /^[a-zA-Z0-9 ]+$/ 
  }, // [cite: 18]
  dueDate: { type: Date, required: true }, // [cite: 18]
  produceName: { 
    type: String, 
    required: true, 
    minlength: 2, 
    match: /^[a-zA-Z0-9 ]+$/ 
  }, // [cite: 18]
  produceType: { type: String, required: true }, // [cite: 18]
  tonnage: { type: Number, required: true }, // [cite: 18]
  dispatchDate: { type: Date, required: true, default: Date.now } // [cite: 18]
}, { timestamps: true });

module.exports = mongoose.model('CreditSale', creditSaleSchema);