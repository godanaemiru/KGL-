const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['manager', 'sales_agent', 'director'] 
  }, // [cite: 9, 23, 24, 25]
  branch: { 
    type: String, 
    enum: ['Maganjo', 'Matugga', 'All'] // Director has access to 'All'
  }
});

module.exports = mongoose.model('User', userSchema);