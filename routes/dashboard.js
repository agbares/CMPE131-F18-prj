/**
 * Dashboard route that defines dashboard logic.
 * @module dashboard
 */

/* Dependencies */
var express = require('express');
var router = express.Router();
// var passport = require('passport');
var auth = require('../middlewares/auth')

/* Routes */
router.get('/', auth.isAuthenticated, function(req, res) {
  res.send('Dashboard');
});

/* Export Module */
module.exports = router;