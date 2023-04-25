const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const Listing = require('../models/Listing');
const Unit = require('../models/Unit');
const cors = require('cors')

const router = express.Router();
router.use(cors())


// Get all Listings
router.get('/', async function(req, res, next) {

    try {
        const data = await Listing.find({listingStatus : 'PUBLIC'});
        res.json(data);
      } catch (error) {
        res.status(400).json({error: error.message});
      }
  });


// Add a Listing
router.post('/', async (req, res) => {

	try{
		const unit = await Unit.findOne({_id : req.body.unitId})
		const listing = new Listing({
			address: unit.address,
			title: req.body.title,
			description: req.body.description,
			dateStart: req.body.dateStart,
			dateEnd: req.body.dateEnd,
			listingStatus: req.body.listingStatus ?  req.body.listingStatus : 'HIDDEN',
			unitId: unit._id
		})
		await listing.save()
		res.send(listing)

	}catch{
		res.status(404)
		res.send({ status: "Not found", message: "Unit not found " })
	}
  
  });

// // Get users Units
// router.get("/my", async (req, res) => {
// 	try {
// 		const unit = await Unit.find({ owner: '6444b5b249daca2fba385653' })
// 		res.send(unit)
// 	} catch {
// 		res.status(404)
// 		res.send({ status: "Not found", message: "Units not found " })
// 	}
// })

  // Get Listing by id
router.get("/:id", async (req, res) => {
	try {
		const listing = await Listing.findOne({ _id: req.params.id })
		res.send(listing)
	} catch {
		res.status(404)
		res.send({ status: "Not found", message: "Listing not found" })
	}
})

// Change listing status
router.put('/:id/changeStatus', async (req, res) => {
    try {
		const listing = await Listing.findOne({ _id: req.params.id })

		if (listing.listingStatus === 'PUBLIC') {
			listing.listingStatus = 'HIDDEN'
		}else if (listing.listingStatus === 'HIDDEN') {
			listing.listingStatus = 'PUBLIC'
		}else{
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

// edit a listing
router.put('/:id', async (req, res) => {
    try {
		const listing = await Listing.findOne({ _id: req.params.id })

		if (req.body.capacity) {
			post.capacity = req.body.capacity
		}

        if (req.body.unitType) {
			post.unitType = req.body.unitType
		}

		if (req.body.address) {
			post.address = req.body.address
		}

		await post.save()
		res.send(post)
	} catch {
		res.status(404)
		res.send({ status: "Not found", message: "Listing not found" })
	}
  });
  
// delete a listing
router.delete('/:id', async (req, res) => {
    try {
		await Listing.deleteOne({ _id: req.params.id })
		res.status(204).send()
	} catch {
		res.status(404)
		res.send({ message: "Listing not found" })
	}

});

module.exports = router;
