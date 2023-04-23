var express = require('express');
var router = express.Router();

const User = require('../models/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', async function(req, res, next){
  try {
    const newUser = new User({
      firstname: req.body.firstname, 
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
    });
    await newUser.save();
    res.send(newUser)
  } catch (error) {
    res.status(400)
		res.send({ status: 400 , message: error.message })
  }
});

module.exports = router;
