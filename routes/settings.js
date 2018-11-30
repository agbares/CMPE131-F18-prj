/**
 * Settings route that defines settings logic.
 * @module settings
 */

/* Dependencies */
var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
var User = require('../models/user');
var Account = require('../models/account');
var Transaction = require('../models/transaction');

/* Routes */
router.get('/', auth.isAuthenticated, function(req, res) {
  var front_end_values = {
    checkingAccount: null,
    savingAccount: null,
    creditAccount: null,
    error: req.flash('error')[0]
  }
  
  Account.find({user_ID: req.user._id}, function(err, accounts){
    if(err){
      console.log(err);
    }
    
    for(var i = 0; i < accounts.length; i++)
    {
      if(accounts[i].type == 'checking'){
        front_end_values.checkingAccount = accounts[i];
      }
      else if(accounts[i].type == 'saving'){
        front_end_values.savingAccount = accounts[i];
      }
      else if(accounts[i].type == 'credit'){
        front_end_values.creditAccount = accounts[i];
      }
      else{
        console.log('No Accounts');
      }
    }
    res.render('dashboard/settings', front_end_values);
  })

});

router.post('/change-password', auth.isAuthenticated, function(req, res, next) {
  const oldPass = req['body']['old-password'];
  const newPass = req['body']['new-password'];
  const confirmNewPass = req['body']['confirm-new-password'];

  if(isEmpty(oldPass, newPass) == true){
    req.flash('error', 'A field is empty. ');
    //return res.redirect('change-password');
    return res.redirect('/dashboard/settings');
  }

  if(samePass(oldPass, newPass) == true){
    req.flash('error', 'Old password and new password is the same. ');
    // return res.redirect('change-password');
    return res.redirect('/dashboard/settings');
  }

  if(newPass == confirmNewPass){
    req.user.changePassword(oldPass, newPass)
    .then((response)=>{
      if(response == false){
        req.flash('error', 'Password does not match your current password. ');
        //return res.redirect('change-password');
        return res.redirect('/dashboard/settings');
      }
      else{
        return res.redirect('/dashboard');
      }
    })
    .catch((err) => {
      next(err);
    })
  }

  else{
    req.flash('error', 'New password confirmation is wrong. ');
    //return res.redirect('change-password');
    return res.redirect('/dashboard/settings');
  }
});


router.post('/close-account', auth.isAuthenticated, function(req, res, next){
  const closeAcc = req['body']['account-id'];
  (async function() {
    var acc = await Account.getAccount(closeAcc);
      if(acc.type == 'credit'){
        if(acc.balance > 0){
          request.flash('error', 'You still owe money for your credit account. ');
          return res.redirect('/dashboard/settings');
        }
        else{
          // await Account.findByIdAndRemove(closeAcc);
          return res.redirect('/dashboard');
        }
      }
      else if(acc.type == 'saving'){
        if(acc.balance == 0){
          return res.redirect('/dashboard');
          //return Account.findByIdAndRemove(closeAcc)
        }
        else{
          var checking_acc = await Account.findOne({user_ID: req.user._id, type: 'checking'}).exec();
          // checking_acc.balance = parseFloat(checking_acc.balance) + parseFloat(acc.balance);
          await Account.transfer(acc._id, checking_acc._id, acc.balance);
          // await checking_acc.save();
          //await Account.findByIdAndRemove(closeAcc);
          return res.redirect('/dashboard');
        }
      }
  })().then((res) => {

  }).catch((err) => {
    next(err);
  })
});

router.post('/close-user', auth.isAuthenticated, function(req, res, next){
  //const closeUser = req['body']['user-id'];
  // (async function () {
  //   var user = await Account.getAccounts(closeUser);
  //   for(var i = 0; i < user.length; i++){
  //     if(user[i] == 'checking'){
  //       if(isEmptyBalance(user[i].balance) == true){

  //       }
  //     }
  //   }
  // })
  var userID = req.user._id;
  var account = null;
  Account.getAccounts(userID)
  .then((res)=>{
    account = res;
    for(var i = 0; i < res.length; i++){
      if(res[i] == 'checking'){ //Only checked for checkings in the first .then because a user will always have a checkings.
        if(hasBalance(res[i].balance) == true){
          return true;
        }
        else{
          return false;
        }
      }
    }
    return true; //If there's no checkings then you return true because it's like the same thing as having
                 //checkings >= 0. 
  })
  .then((res)=>{
    if(res == true){
      for(var i = 0; i < account.length; i++){
        if(account[i] == 'saving'){
          if(hasBalance(account[i].balance) == true){
            return true;
          }
          else{
            return false;
          }
        }
      }
      return true;
    }
    else{
      return false;
    }
  })
  .then((res)=>{
    if(res == true){
      for(var i = 0; i < account.length; i++){
        if(account[i] == 'credit'){
          if(account[i].balance == 0){
            //Account.findByIdAndDelete(closeUser);
            return res.redirect('/dashboard');
          }
          else{
            return res.redirect('close-user');
          }
        }
      }
      //Account.findByIdAndDelete(closeUser);
      return res.redirect('/dashboard'); //This means that there isnt a "credit" which is fine. 
    }
    else{
      return res.redirect('close-user');
    }
  })
  .catch((err)=>{
    next(err);
  })
});

function isEmpty(oldPass, newPass){
  if(oldPass.length == 0 || newPass.length == 0){
    return true;
  }
  else{
    return false;
  }
}

function samePass(oldPass, newPass){
  if(oldPass == newPass){
    return true;
  }
  else{
    return false;
  }
}

function hasBalance(balance){
  if(balance >= 0){
    return true;
  }
  else{
    return false;
  }
}

/* Export Module */
module.exports = router;