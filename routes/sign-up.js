// Sign Up Router
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('sign-up/index', {});
});

module.exports = router;
