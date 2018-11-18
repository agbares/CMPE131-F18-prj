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

  console.log(transferAmount);

  if(validAmount(transferAmount) == true){
    transferMoney(transferAmount, transferFrom, transferTo, req.user._id);
  }
  else
  {
    req.flash('error', 'Amount is negative.');
    return res.redirect('transfer');
  }
  res.render('dashboard/transfer');
})

function transferMoney(temp_transfer_amount, temp_transfer_from, temp_transfer_to, user_ID){ //A function where the transferring will be happening. 
  Account.find({user_ID: user_ID}, function(err, accounts){
    if(err){
      console.log(err);
    }
    console.log(accounts.length);
    console.log(user_ID);
    var tempAmountHold = 0;

    if(temp_transfer_from == temp_transfer_to){
      console.log("Can't transfer money in the same account."); //"Same Account" as in transferring from savings to savings, checkings to checkings, etc. 
    }

    for(var i = 0; i < accounts.length; i++){
      console.log(accounts[i].type);
      console.log(temp_transfer_to);

      if(accounts[i].type == temp_transfer_from){
        for(var j = 0; j < accounts.length; j++){
          if(accounts[j].type == temp_transfer_to){

            accounts[i].balance -= temp_transfer_amount;
            tempAmountHold = parseInt(accounts[j].balance) + parseInt(temp_transfer_amount);
            accounts[j].balance = tempAmountHold;
            var accountsChecking = accounts[i];
            var accountsSaving = accounts[j];
            accountsChecking.save(function(err, res){
              if(err){
                console.log(err);
              }
              console.log(res);
            })

            accountsSaving.save(function(err, res){
              if(err){
                console.log(err);
              }
              console.log(res);
            })
          }
          else{
            console.log('Not the correct account.');
          }
        }
      }
      else{
        console.log('Not the correct account.');
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