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

  if(isEmpty == true){
    request.flash('error', 'A field is empty. ');
    return res.redirect('change-password');
  }

  if(samePass == true){
    request.flash('error', 'Old password and new password is the same. ');
    return res.redirect('change-password');
  }

  if(newPass == confirmNewPass){
    req.user.changePassword(oldPass, newPass)
    .then((response)=>{
      if(response == false){
        request.flash('error', 'Password does not match your current password. ');
        return res.redirect('change-password');
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
    request.flash('error', 'New password confirmation is wrong. ');
    return res.redirect('change-password');
  }
});

router.post('/close-account'), auth.isAuthenticated, function(req, res, next){
  const closeAcc = req['body']['account-id'];
  (async function() {
    var acc = await Account.getAccount(closeAcc)
    .then((acc)=>{
      if(acc.type == 'credit'){
        if(acc.balance > 0){
          request.flash('error', 'You still owe money for your credit account. ');
          return res.redirect('close-account');
        }
        else{
          return Account.findByIdAndRemove(closeAcc);
        }
      }
      else if(acc.type == 'saving'){
        if(acc.balance == 0){
          return Account.findByIdAndRemove(closeAcc)
        }
        else{
          var checking_acc = Account.findOne({user_ID: req.user._id, type: 'checking'});
          checking_acc.balance = parseInt(checking_acc.balance) + parseInt(acc.balance);
          return Account.findByIdAndRemove(closeAcc);
        }
      }
    })

  })().then((res) => {

  }).catch((err) => {
    next(err);
  })
}

router.post('/close-user'), auth.isAuthenticated, function(req, res, next){

}

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

/* Export Module */
module.exports = router;