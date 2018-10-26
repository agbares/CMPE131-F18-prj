/**
 * Sign In route that defines sign in logic.
 * @module sign-in
 */

 /* Dependencies */
var express = require('express');
var router = express.Router();
var passport = require('passport');

/* Routes */
router.get('/', function(req, res, next) {
  res.render('sign-in/index', {});
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/sign-in',
  failureFlash: true
}));

/* Export Module */
module.exports = router;
