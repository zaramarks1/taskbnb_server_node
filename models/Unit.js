const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Int32 } = require('mongodb');


const unitSchema = new mongoose.Schema({
    unitType: {
      type: String,
      enum:['HOUSE', 'APT', 'STUDIO', 'ROOM']
    },
    capacity:{
      type: Number
    },
    address: {
      type: String,
      required:true
    },
    ownerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    listings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing"
      }
    ],
  });

module.exports = mongoose.model('Unit', unitSchema);