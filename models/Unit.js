const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Int32 } = require('mongodb');
const Listing = require('./Listing');

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

  // unitSchema.pre('deleteOne', async function (next) {
  //   const listings = await Listing.find({ unitId: this._id }).exec();
  //   console.log(listings)
  //   console.log('entrou')
  //   try {
  //     await Listing.deleteMany({ _id: { $in: listings } });
  //     next();
  //   } catch (error) {
  //     next(error);
  //   }
  // });

module.exports = mongoose.model('Unit', unitSchema);