var express = require('express');
var router = express.Router();

/* Load other routes */
router.use('/sign-in', require('./sign-in'));
router.use('/sign-up', require('./sign-up'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Spartan Financial Group (SFG) Banking' });
});

module.exports = router;