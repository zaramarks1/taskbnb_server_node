const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const Unit = require('../models/Unit');
const Listing = require('../models/Listing');
const cors = require('cors')

const router = express.Router();
router.use(cors())


// Get all units
router.get('/', async function(req, res, next) {

    try {
        const data = await Unit.find();
        res.json(data);
      } catch (error) {
        res.status(400).json({message: error.message});
      }
  });


// Add a Unit
router.post('/', async (req, res) => {
	try{
		const unit = new Unit({
			address: req.body.address,
			capacity: req.body.capacity,
			unitType: req.body.unitType,
			owner: '6444b5b249daca2fba385653'
		})
		await unit.save()
		res.send(unit)
	}catch(error){
		res.status(400).json({message: error.message});
	}
   
  });

// Get users Units
router.get("/my", async (req, res) => {
	try {
		const unit = await Unit.find({ owner: '6444b5b249daca2fba385653' })
		res.send(unit)
	} catch {
		res.status(404)
		res.send({ status: "Not found", message: "Units not found" })
	}
})

  // Get Unit by id
router.get("/:id", async (req, res) => {
	try {
		const unit = await Unit.findOne({ _id: req.params.id })
		res.send(unit)
	} catch {
		res.status(404)
		res.send({ status: "Not found", message: "Unit not found" })
	}
})


// Get listing by unit
router.get("/:id/listings", async (req, res) => {
	try {
		const listings = await Listing.find({ unitId: req.params.id })
		res.send(listings)
	} catch {
		res.status(404)
		res.send({ status: "Not found", message: "Listings not found" })
	}
})



// edit a unit
router.put('/:id', async (req, res) => {
    try {
		const post = await Unit.findOne({ _id: req.params.id })

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
		res.send({ status: "Not found", message: "Unit not found" })
	}
  });
  
// delete a unit
router.delete('/:id', async (req, res) => {
    try {
		await Unit.deleteOne({ _id: req.params.id })
		res.status(204).send()
	} catch {
		res.status(404)
		res.send({ message: "Unit not found" })
	}

});

module.exports = router;
