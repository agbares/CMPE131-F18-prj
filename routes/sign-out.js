/**
 * Sign Out route that defines sign out logic.
 * @module sign-out
 */

/* Dependencies */
var express = require('express');
var router = express.Router();

/* Routes */
router.get('/', function(req, res, next) {
  req.logOut();
  res.redirect('/');
});

/* Export Module */
module.exports = router;