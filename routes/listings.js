const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const passport = require('passport');
const Listing = require('../models/Listing');
const Unit = require('../models/Unit');
const cors = require('cors')

const router = express.Router();
router.use(cors())


// Get all Listings
router.get('/', async function(req, res, next) {

    try {
        // Find all listings that are public
        const data = await Listing.find({listingStatus : 'PUBLIC'});
        res.json(data);
    } catch (error) {
        // Return error if unable to fetch data
        res.status(400).json({error: error.message});
    }
});


// Add a Listing
router.post('/', passport.authenticate('jwt', { session: false }),async (req, res) => {

    try{
        // Find the unit associated with the listing
        const unit = await Unit.findOne({_id : req.body.unitId})

        // Check if the user owns the unit
        if(!unit.ownerId.equals(req.user._id)){
            res.status(401)
            res.send({ status: "Forbidden", message: "Not allowed to create a listing for this unit!" })
        } else {
            // Create a new listing with the provided details
            const listing = new Listing({
                address: unit.address,
                title: req.body.title,
                description: req.body.description,
                dateStart: req.body.dateStart,
                dateEnd: req.body.dateEnd,
                listingStatus: req.body.listingStatus ?  req.body.listingStatus : 'HIDDEN',
                unitId: unit._id
            })

            // Save the listing
            await listing.save()

            // Add the listing to the associated unit
            unit.listings.push(listing)
            unit.save()

            // Return the created listing
            res.send(listing)
        }
    } catch{
        // Return error if unable to add listing
        res.status(404)
        res.send({ status: "Not found", message: "Unit not found " })
    }
});


// Get Listing by id
router.get("/:id", async (req, res) => {
    try {
        // Find the listing with the given id
        const listing = await Listing.findOne({ _id: req.params.id })

        // Return the listing
        res.send(listing)
    } catch {
        // Return error if unable to fetch listing
        res.status(404)
        res.send({ status: "Not found", message: "Listing not found" })
    }
})

// Change listing status
router.put('/:id/changeStatus', passport.authenticate('jwt', { session: false }), async (req, res) => {
	try {
		// Find the listing by ID and populate the "unitId" field
		const listing = await Listing.findOne({ _id: req.params.id }).populate("unitId")

		// Check if the user owns the listing's associated unit
		if (!listing.unitId.ownerId.equals(req.user._id)) {
			res.status(401)
			res.send({ status: "Forbidden", message: "Not allowed to modify this listing!" })
		}

		// Change the listing's status based on its current status
		if (listing.listingStatus === 'PUBLIC') {
			listing.listingStatus = 'HIDDEN'
		} else if (listing.listingStatus === 'HIDDEN') {
			listing.listingStatus = 'PUBLIC'
		} else {
			res.status(500)
			res.send({ status: "Forbidden", message: "Not allowed to change the status of this listing" })
		}
		await listing.save()
		res.send(listing)
	} catch {
		res.status(404)
		res.send({ status: "Not found", message: "Listing not found a" })
	}
});

// Edit a listing
router.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
	try {
		// Find the listing by ID and populate the "unitId" field
		const listing = await Listing.findOne({ _id: req.params.id }).populate("unitId")

		// Check if the user owns the listing's associated unit
		if (!listing.unitId.ownerId.equals(req.user._id)) {
			res.status(401)
			res.send({ status: "Forbidden", message: "Not allowed to modify this listing!" })
		} else {
			// Update the listing's properties if provided
			if (req.body.title) {
				listing.title = req.body.title
			}

			if (req.body.dateStart) {
				listing.dateStart = req.body.dateStart
			}

			if (req.body.dateEnd) {
				listing.dateEnd = req.body.dateEnd
			}

			if (req.body.description) {
				listing.description = req.body.description
			}

			await listing.save()
			res.send(listing)
		}
	} catch {
		res.status(404)
		res.send({ status: "Not found", message: "Listing not found" })
	}
});

// Delete a listing
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
	try {
		// Find the listing by ID and populate the "unitId" field
		const listing = await Listing.findOne({ _id: req.params.id }).populate("unitId")

		// Check if the user owns the listing's associated unit
		if (!listing.unitId.ownerId.equals(req.user._id)) {
			res.status(401)
			res.send({ status: "Forbidden", message: "Not allowed to modify this listing!" })
		} else {
			// Delete the listing
			await Listing.deleteOne({ _id: req.params.id })
			res.status(204).send()
		}
	} catch {
		res.status(404)
		res.send({ message: "Listing not found" })
	}

});

module.exports = router;
