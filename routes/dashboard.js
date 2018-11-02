/**
 * Dashboard route that defines dashboard logic.
 * @module dashboard
 */

/* Dependencies */
var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth')
var User = require('../models/user');
var Account = require('../models/account');

/* Routes */
router.get('/', auth.isAuthenticated, function(req, res) {
  var accountObj = {
    checkingAccount: null,
    savingAccount: null,
    creditAccount: null
  }
  
  Account.find({user_ID: req.user._id}, function(err, accounts){
    if(err){
      console.log(err);
    }
    console.log(accounts);
    
    for(var i = 0; i < accounts.length; i++)
    {
      if(accounts[i].type == 'checking'){
        accountObj.checkingAccount = accounts[i];
      }
      else if(accounts[i].type == 'saving'){
        accountObj.savingAccount = accounts[i];
      }
      else if(accounts[i].type == 'credit'){
        accountObj.creditAccount = accounts[i];
      }
      else{
        console.log('No Accounts');
      }
    }
    console.log(accountObj.checkingAccount);
    res.render('dashboard/index', accountObj);
  })
});

/* Export Module */
module.exports = router;