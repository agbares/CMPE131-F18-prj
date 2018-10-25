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
      User.findOne({email: email}, (err, user) => {
        if (err) {
          return done(err);
        }
        
        if (!user) {
          return done(null, false, {message: 'Incorret email.'});
        }

        user.authenticate(password).then((res) => {
          if (res) {
            // Correct Password
            return done(null, user);
          }
          else {
            // Incorrect Password
            return done(null, false, {message: 'Incorrect password.'});
          }
        }).catch((err) => {
          return done(err);
        });
      });
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