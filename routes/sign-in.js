// Sign In route

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('sign-in/index', {});
});

module.exports = router;
