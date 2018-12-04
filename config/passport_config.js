/**
 * Authentication middleware module that handles authentication for routes requiring auth.
 * @module passport
 */

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

function initPassport() {
  
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    }, (email, password, done) => {
      (async function() {
        
        const user = await User.getUser(email);
        if (!user)
          return done(null, false, {message: 'Incorrect email.'});

        const authenticated = await user.authenticate(password);
        if (authenticated)
          return done(null, user);
        else
          return done(null, false, {message: 'Incorrect password.'});

      })().then().catch(err => done(err));
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  })
}

module.exports = {
  initPassport
};