/**
 * account route that defines account logic.
 * @module account
 */

/* Dependencies */
var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
var Account = require('../models/account');
var Transaction = require('../models/transaction');

/* Routes */
router.get('/:accountId', auth.isAuthenticated, auth.accountBelongsToUser, function(req, res, next) {
  const accountId = req.params.accountId;
  
  // Using a IIFE since it's cleaner than using a Promise chain & passing account to next in chain.
  (async function() {
    const account = await Account.getAccount(accountId);
    const transactions = await Transaction.getTransactions(accountId);
    
    transactions.reverse(); //The new added code to reverse the transactions. 
    res.render('dashboard/account', {account: account, transactions: transactions});  

  })().catch((err) => {
    next(err);
  });
});

/* Export Module */
module.exports = router;