/**
 * Sign Up route that defines sign up logic.
 * @module sign-up
 */

/* Dependencies */
var express = require('express');
var router = express.Router();
var passport = require('passport')
var User = require('../models/user');
var Account = require('../models/account');

/* Routes */
router.get('/', function(req, res, next) {
  res.render('sign-up/index', {error: req.flash('error')[0]});
});

router.post('/', function(req, res, next) {
  // Get data from the form
  const firstName = req['body']['first-name'];
  const lastName = req['body']['last-name'];
  const email = req['body']['email'];
  const password = req['body']['password'];
  const confirmPassword = req['body']['confirm-password'];

  // Check data from the form
  if (!isValidInput(firstName, lastName, email, password, confirmPassword)) {
    req.flash('error', 'All fields are required.');
    return res.redirect('sign-up');
  }

  (async function() {
    const user = await User.createUser(firstName, lastName, email, password, null, null);
    
    if (!user) {
      req.flash('error', 'User already exists with the given email');
      return res.redirect('sign-up');
    }
    
    // Create a checking account for the new user
    const checking = await Account.createChecking(user._id);
    
    // User creation was successful, so we'll pass control to the auth middleware
    // to authenticate the new user.
    return next();
  
  })().then().catch(err => next(err));

}, passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/sign-in',
  failureFlash: true
}));

/* Utility Methods */

/**
 * Checks whether the input is valid or not.
 * @function isValidInput
 * @param {string} firstName
 * @param {string} lastName 
 * @param {string} email 
 * @param {string} password 
 * @param {string} confirmPassword 
 * @returns {boolean} Determines whether the supplied input is valid or not.
 */
function isValidInput(firstName, lastName, email, password, confirmPassword) {
  if (firstName.length == 0) {
    return false;
  }
  
  if (lastName.length == 0) {
    return false;
  }

  if (email.length == 0) {
    return false;
  }

  if (password.length == 0) {
    return false;
  }

  if (confirmPassword.length == 0) {
    return false;
  }

  // Check if the passwords match
  if (password != confirmPassword) {
    return false;
  }
  
  return true;
}

/* Export Module */
module.exports = router;