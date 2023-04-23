const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Int32 } = require('mongodb');


const unitSchema = new mongoose.Schema({
    unitType: {
      type: String
    },
    capacity:{
      type: Number
    },
    address: {
      type: String,
      required:true
    },
    owner: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }
  });

module.exports = mongoose.model('Unit', unitSchema);