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
        return done(null, false);
    }
    const isMatch = await aUser.matchPassword(password);
    if (!isMatch) {
        return done(null, false);
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
        return done(null, aUser);
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
router.post('/signup', async function(req, res, next) {
  try {
    const newUser = new User({
        firstname: req.body.firstname,
        lastname:req.body.lastname,
        email: req.body.email,
        password: req.body.password,
    });
    const savedDoc = await newUser.save();
    req.login(savedDoc, function(err){
      if (err) { return next(err); }
      return res.redirect('/users');
    });
  } catch (error) {
    return next(error);
  }
});



/* POST api login. */
router.post('/authenticate', passport.authenticate('local', { session: false }), async function(req, res, next) {
//   const cookies = req.cookies;
  const foundUser = await User.findOne({ email: req.user.email }).exec();

  const accessToken = jwt.sign({email: foundUser.email}, jwtAccessSecret, {
    expiresIn: "1d"
  });

//   const refreshToken = jwt.sign({email: foundUser.email}, jwtRefreshSecret, {
//     expiresIn: "1d"
//   });

//   let existingRefreshTokenArray = !cookies?.jwt ? foundUser.refreshToken : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);

//   if (cookies?.jwt) {
//     // old token reuse or no logout and tries to login again
//     const cookieRefreshToken = cookies.jwt;
//     const foundToken = await User.findOne({refreshToken: cookieRefreshToken}).exec();
//     // old token reuse
//     if (!foundToken) {
//       existingRefreshTokenArray = [];
//     }
//     res.clearCookie('jwt', { 
//       httpOnly: true, 
//       sameSite: 'None', 
//       //secure: true,
//     });
//   }

//   foundUser.refreshToken = [refreshToken, ...existingRefreshTokenArray];
//   const result = await foundUser.save();

//   res.cookie('jwt', refreshToken, { 
//     httpOnly: true, 
//     sameSite: 'None', 
//     //secure: true, 
//     maxAge: 24 * 60 * 60 * 1000, //1 day
//   });

  res.json({
    firstname:foundUser.firstname,
    lastname:foundUser.lastname,
    email: foundUser.email,
    token:accessToken
  });
});

module.exports = router;

