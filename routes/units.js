const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const passport = require('passport');
const Unit = require('../models/Unit');
const Listing = require('../models/Listing');
const cors = require('cors')

const router = express.Router(); // Initialize router object using express.Router()
router.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)

// Get all units
router.get('/', async function(req, res, next) {
    try {
        const data = await Unit.find(); // Find all units from database
        res.json(data); // Send the data as a JSON response
    } catch (error) {
        res.status(400).json({message: error.message}); // Handle any errors
    }
});

// Add a Unit
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        // Create a new unit object with the provided data
        const unit = new Unit({
            address: req.body.address,
            capacity: req.body.capacity,
            unitType: req.body.unitType,
            ownerId: req.user._id
        });
        await unit.save(); // Save the unit to the database
        res.send(unit); // Send the created unit as a response
    } catch (error) {
        res.status(400).json({message: error.message}); // Handle any errors
    }
});

// Get user's Units
router.get("/my", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        // Find all units that belong to the authenticated user
        const units = await Unit.find({ ownerId: req.user._id });
        res.send(units); // Send the found units as a response
    } catch (error){
        res.status(404).send({ status: "Not found", message: error.message}); // Handle any errors
    }
});

// Get Unit by ID
router.get("/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        // Find a unit by its ID
        const unit = await Unit.findOne({ _id: req.params.id });
        res.send(unit); // Send the found unit as a response
    } catch (error){
        res.status(404).send({ status: "Not found", message: error.message}); // Handle any errors
    }
});

// Get listings by unit
router.get("/:id/listings", async (req, res) => {
    try {
        // Find all listings related to a unit by its ID
        const listings = await Listing.find({ unitId: req.params.id });
        res.send(listings); // Send the found listings as a response
    } catch(error) {
        res.status(404).send({ status: "Not found", message: error.message }); // Handle any errors
    }
});

// Edit a unit
router.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        // Find the unit to be edited
        const unit = await Unit.findOne({ _id: req.params.id })

        // Checking if the user owns the unit
        if(!unit.ownerId.equals(req.user._id)){
            res.status(401)
            res.send({ status: "Forbidden", message: "Not allowed to modify this unit!" })
        }
        else{
            // Update the unit's capacity if provided in the request body
            if (req.body.capacity) {
                unit.capacity = req.body.capacity
            }

            // Update the unit's type if provided in the request body
            if (req.body.unitType) {
                unit.unitType = req.body.unitType
            }

            // Update the unit's address if provided in the request body
            if (req.body.address) {
                unit.address = req.body.address
            }

            // Save the updated unit
            await unit.save()
            res.send(unit)
        }

    } catch (error){
        res.status(404)
        res.send({ status: "Not found", message: 'Unit not found' })
    }
});

// Delete a unit
router.delete('/:id',  passport.authenticate('jwt', { session: false }),async (req, res) => {
    try {
        // Find the unit to be deleted and populate its listings
        const unit = await Unit.findOne({ _id: req.params.id }).populate("listings")

        // Checking if the user owns the unit
        if(!unit.ownerId.equals(req.user._id)){
            res.status(401)
            res.send({ status: "Forbidden", message: "Not allowed to modify this unit!" })
        }else{
            // Delete all the listings related to the unit
            await Listing.deleteMany({ _id: { $in: unit.listings } });

            // Delete the unit itself
            await Unit.deleteOne(unit)

            // Send a 204 status code to indicate that the request was successful but there is no content to return
            res.status(204).send()
        }
        
    } catch {
        res.status(404)
        res.send({ message: "Unit not found" })
    }
});

module.exports = router;
