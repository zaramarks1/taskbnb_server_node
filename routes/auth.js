const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const jwtAccessSecret = "This is my JWT access secret, it should be in a .env file!";

const cors = require('cors')
router.use(cors())

async function localAuthUser(email, password, done) {
  try {
    const aUser = await User.findOne({email: email});
    if (!aUser) {
        console.log('AAAA');
        return done(null, false, { message: "User not found" });
        // return { success: false, message: 'User not found' };
    }
    const isMatch = await aUser.matchPassword(password);
    if (!isMatch) {
        return done(null, false, { message: "Password and email do not match" });
    }
    return done(null, aUser);
  } catch (error) {
      console.log(error);
      return done(error, false);
  }
};


passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, localAuthUser));

const jwt_opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer '),
  secretOrKey: jwtAccessSecret,
};

passport.use('jwt', new JwtStrategy(jwt_opts, async function(jwt_payload, done) {
  try {
    const aUser = await User.findOne({email: jwt_payload.email});
    if (aUser) {
        return done(null, aUser, { message: "User not found" });
    } else {
      return done(null, false);
    }
  } catch (error) {
      console.log(error);
      return done(error, false);
  }
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


/* POST Signup form. */
router.post('/register', async function(req, res, next) {
  try {
    const newUser = new User({
        firstname: req.body.firstname,
        lastname:req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        role:'USER'
    });
    const savedUser = await newUser.save();
    const accessToken = jwt.sign({email: savedUser.email}, jwtAccessSecret, {
        expiresIn: "1d"
      });
    res.json({
        _id:savedUser.id,
        firstname:savedUser.firstname,
        lastname:savedUser.lastname,
        email: savedUser.email,
        token:accessToken
      });
  } catch (error) {
    res.status(400).json({message: error.message});
  }
});



/* POST api login. */
router.post('/authenticate', passport.authenticate('local', { session: false }), async function(req, res, next) {
//   const cookies = req.cookies;
    try{
        const foundUser = await User.findOne({ email: req.user.email }).exec();

        const accessToken = jwt.sign({email: foundUser.email}, jwtAccessSecret, {
            expiresIn: "1d"
          });

          res.json({
            firstname:foundUser.firstname,
            lastname:foundUser.lastname,
            email: foundUser.email,
            token:accessToken
          });

    }catch(error){
        console.log('not found')
        res.status(401).json({message: 'User not found'})
    }

});

module.exports = router;

