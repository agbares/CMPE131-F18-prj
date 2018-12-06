/**
 * find-atm route that defines find-atm logic.
 * @module find-atm
 */

/* Dependencies */
var express = require('express');
var router = express.Router();

/* Routes */
router.get('/', function(req, res, next) {
  var isAuthenticated = false;

  if (req.isAuthenticated())
    isAuthenticated = true;

  res.render('find-atm', {isAuthenticated: isAuthenticated});
});

/* Export Module */
module.exports = router;