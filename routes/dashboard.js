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
    res.render('dashboard/index', accountObj);
  })
});

router.get('/transfer', auth.isAuthenticated, function(req, res, next) {
  var accountObj = {
    checkingAccount: null,
    savingAccount: null,
    creditAccount: null
  }

  Account.getAccounts(req.user._id).then((accounts) => {
    for(var i = 0; i < accounts.length; i++) {
      if(accounts[i].type == 'checking') {
        accountObj.checkingAccount = accounts[i];
      
      } else if(accounts[i].type == 'saving') {
        accountObj.savingAccount = accounts[i];
      
      } else if(accounts[i].type == 'credit') {
        accountObj.creditAccount = accounts[i];
      }
    }
    
    res.render('dashboard/transfer', accountObj);

  }).catch((err) => {
    next(err);
  });
});

router.post('/transfer', function(req, res, next){
  const transferAmount = req['body']['transferamount']; //Getting the amount from the user.
  const transferFrom = req['body']['transferfrom']; //Getting the radio choice. 
  const transferTo = req['body']['transferto']; //Getting the radio choice.
  const email = req['body']['email'];

  if (transferTo == 'email')
    transferTo = email;

  Account.transfer(transferFrom, transferTo, transferAmount).then((response) => {
    if (response.errorMessage !== null) {
      req.flash('error', response.errorMessage);
      return res.redirect('transfer');
    }

    return res.redirect('transfer');
    
  }).catch((err) => {
    next(err);
  });
});

router.get('/billpay', auth.isAuthenticated, function(req, res, next) {
  var accountObj = {
    checkingAccount: null,
    savingAccount: null,
    creditAccount: null
  }

  Account.getAccounts(req.user._id).then((accounts) => {
    for(var i = 0; i < accounts.length; i++) {
      if(accounts[i].type == 'checking') {
        accountObj.checkingAccount = accounts[i];
      
      } else if(accounts[i].type == 'saving') {
        accountObj.savingAccount = accounts[i];
      
      } else if(accounts[i].type == 'credit') {
        accountObj.creditAccount = accounts[i];
      }
    }

    res.render('dashboard/billpay', accountObj);

  }).catch((err) => {
    next(err);
  });
});

router.get('/deposit', auth.isAuthenticated, function(req, res, next) {
  var accountObj = {
    checkingAccount: null,
    savingAccount: null,
    creditAccount: null
  }

  Account.getAccounts(req.user._id).then((accounts) => {
    for(var i = 0; i < accounts.length; i++) {
      if(accounts[i].type == 'checking') {
        accountObj.checkingAccount = accounts[i];
      
      } else if(accounts[i].type == 'saving') {
        accountObj.savingAccount = accounts[i];
      
      } else if(accounts[i].type == 'credit') {
        accountObj.creditAccount = accounts[i];
      }
    }

    res.render('dashboard/deposit', accountObj);

  }).catch((err) => {
    next(err);
  });
});

/* Export Module */
module.exports = router;