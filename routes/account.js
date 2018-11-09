/**
 * account route that defines account logic.
 * @module account
 */

/* Dependencies */
var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
var Account = require('../models/account');

/* Routes */
router.get('/:accountId', auth.isAuthenticated, function(req, res, next) {
  
   res.render("dashboard/account");
  //res.send('Specific Account Page'); // Remove when using res.render()
});


router.get('/:accountId/transfer', auth.isAuthenticated, function(req, res, next) {
  
  // res.render();
  res.send('Account Transfer Page'); // Remove when using res.render()
});

/* Export Module */
module.exports = router;