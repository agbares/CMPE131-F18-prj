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

  if(transferFrom == transferTo){
    req.flash('error', "Can't transfer money in the same account.");
    return res.redirect('transfer');
  }

  if(validAmount(transferAmount) == true){
    var transferMoney_Response = transferMoney(transferAmount, transferFrom, transferTo, req.user._id, req, res);
    return transferMoney_Response;
  }
  else
  {
    req.flash('error', 'Amount is negative.');
    return res.redirect('transfer');
  }
  
  //res.render('dashboard/transfer');
})

function transferMoney(temp_transfer_amount, temp_transfer_from, temp_transfer_to, user_ID, request, response){ //A function where the transferring will be happening. 
  Account.find({user_ID: user_ID}, (err, accounts) => {
    if(err){
      console.log(err);
    }
    var tempAmountHold = 0;

    for(var i = 0; i < accounts.length; i++){
      if(accounts[i].type == temp_transfer_from){
        console.log('Hi');
        for(var j = 0; j < accounts.length; j++){
          if(accounts[j].type == temp_transfer_to){
            console.log('My name is Jason');
            accounts[i].balance -= temp_transfer_amount;
            tempAmountHold = parseInt(accounts[j].balance) + parseInt(temp_transfer_amount);
            accounts[j].balance = tempAmountHold;
            var accountsChecking = accounts[i];
            var accountsSaving = accounts[j];
            accountsChecking.save(function(error, res){
              if(error){
                console.log(error);
              }
            })

            accountsSaving.save(function(error, res){
              if(error){
                console.log(error);
              }
            })
            return response.redirect('/dashboard');
          }
           else if(j == accounts.length - 1){
            console.log('Not the correct account. 2');
            request.flash('error', 'Not the correct account');
            return response.redirect('transfer');
           }
        }
      }
       else if(i == accounts.length - 1){
        console.log('Not the correct account. 1');
        request.flash('error', 'Not the correct account');
        return response.redirect('transfer');
       }
    }
  })
}

function validAmount(amount){ //Helper function to see if the user put in a positive amount. 
  if(amount > 0){
    return true;
  }
  else{
    return false;
  }
}

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

/* Export Module */
module.exports = router;