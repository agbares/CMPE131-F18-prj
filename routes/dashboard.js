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
    
    for(var i = 0; i < res.length; i++)
    {
      if(res[i].type == 'checking'){
        accountObj.checkingAccount = res[i];
      }
      else if(res[i].type == 'saving'){
        accountObj.savingAccount = res[i];
      }
      else if(res[i].type == 'credit'){
        accountObj.creditAccount = res[i];
      }
      else{
        console.log('No Accounts');
      }
    }
    res.render('dashboard/index', { 
      checking: accountObj.checkingAccount, 
      saving: accountObj.savingAccount, 
      credit: accountObj.creditAccount
    });
  })
});

/* Export Module */
module.exports = router;