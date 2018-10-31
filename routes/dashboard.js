/**
 * Dashboard route that defines dashboard logic.
 * @module dashboard
 */

/* Dependencies */
var express = require('express');
var router = express.Router();
var account = require('../models/account')
// var passport = require('passport');
var auth = require('../middlewares/auth')

/* Routes */
router.get('/', auth.isAuthenticated, function(req, res) {
  var accountObj = {
    checkingAccount: null,
    savingAccount: null,
    creditAccount: null
  }
  
  account.find({user_ID: req.user._id}, function(err, res){
    if(err){
      console.log(err);
    }
    console.log(res);
    
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