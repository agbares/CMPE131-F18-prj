/**
 * Sign Up route that defines sign up logic.
 * @module sign-up
 */

/* Dependencies */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var createError = require('http-errors');

/* Routes */
router.get('/', function(req, res, next) {
  res.render('sign-up/index');
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
    res.redirect('sign-up');
    return;
  }


  
  User.createUser(firstName, lastName, email, password, null, null).then((user) => {
    console.log(user);
    // Log the user in
    return req.logIn(user, (err) => {
      if (err) {
        return Promise.reject(err);
      
      } else {
        return Promise.resolve();
      }
    });
  }).then(() => {
    return res.redirect('/dashboard');

  }).catch((err) => {
    next(err);
  });
});

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