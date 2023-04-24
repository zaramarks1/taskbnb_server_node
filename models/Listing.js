const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ListingSchema = new mongoose.Schema({

    title: {
        type: String,
        require:true
    },

    address:{
        type: String
    },

    description:{
        type:String
    },

    dateStart:{
        type:Date,
        required:true
    },

    dateEnd:{
        type:Date,
        required:true
    },

    listingStatus:{
        type: String,
        enum:['PUBLIC', 'HIDDEN', 'EXPIRED', 'BOOKED']
    },

    unitId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Unit',
        require:true
    }

});

module.exports = mongoose.model('Listing', ListingSchema);



