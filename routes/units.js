const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const passport = require('passport');
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
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
	
	try{
		const unit = new Unit({
			address: req.body.address,
			capacity: req.body.capacity,
			unitType: req.body.unitType,
			owner: req.user._id
		})
		await unit.save()
		res.send(unit)
	}catch(error){
		res.status(400).json({message: error.message});
	}
   
  });

// Get users Units
router.get("/my", passport.authenticate('jwt', { session: false }), async (req, res) => {
	// console.log(req.user._id);
	try {
		const unit = await Unit.find({ owner: req.user._id })
		res.send(unit)
	} catch (error){
		res.status(404)
		res.send({ status: "Not found", message: error.message})
	}
})

  // Get Unit by id
router.get("/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {
	try {
		const unit = await Unit.findOne({ _id: req.params.id })
		res.send(unit)
	} catch (error){
		res.status(404)
		res.send({ status: "Not found", message: error.message})
	}
})


// Get listing by unit
router.get("/:id/listings", async (req, res) => {
	try {
		const listings = await Listing.find({ unitId: req.params.id })
		res.send(listings)
	} catch(error) {
		res.status(404)
		res.send({ status: "Not found", message: error.message })
	}
})



// edit a unit
router.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
		const unit = await Unit.findOne({ _id: req.params.id })
		console.log(unit.owner)
		console.log(req.user._id)

		if(!unit.owner.equals(req.user._id)){
			res.status(401)
			res.send({ status: "Forbidden", message: "Not allowed to modify this unit!" })
		}
		else{
			if (req.body.capacity) {
				unit.capacity = req.body.capacity
			}
	
			if (req.body.unitType) {
				unit.unitType = req.body.unitType
			}
	
			if (req.body.address) {
				unit.address = req.body.address
			}
	
			await unit.save()
			res.send(unit)
		}

	} catch (error){
		res.status(404)
		res.send({ status: "Not found", message: 'Unit not found' })
	}
  });
  
// delete a unit
router.delete('/:id',  passport.authenticate('jwt', { session: false }),async (req, res) => {
	
    try {
		const unit = await Unit.findOne({ _id: req.params.id })
		if(unit.ownerId !== req.user._id){
			res.status(401)
			res.send({ status: "Forbidden", message: "Not allowed to modify this unit!" })
		}
		await Unit.deleteOne(unit)
		res.status(204).send()
	} catch {
		res.status(404)
		res.send({ message: "Unit not found" })
	}

});

module.exports = router;
