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
router.get('/:accountId', auth.isAuthenticated, auth.accountBelongsToUser, function(req, res, next) {
  const accountId = req.params.accountId;

  Account.getAccount(accountId).then((account) => {
    res.render('dashboard/account', { account : account});
    
  }).catch((err) => {
    next(err);
  });
});
/* Export Module */
module.exports = router;