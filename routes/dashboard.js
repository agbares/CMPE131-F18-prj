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
var Billpay = require('../models/billpay');
var Transaction = require('../models/transaction');

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
  var responseObj = {
    checkingAccount: null,
    savingAccount: null,
    creditAccount: null,
    error: req.flash('error')[0]
  }
  
  Account.getAccounts(req.user._id).then((accounts) => {
    for(var i = 0; i < accounts.length; i++) {
      if(accounts[i].type == 'checking') {
        responseObj.checkingAccount = accounts[i];
      
      } else if(accounts[i].type == 'saving') {
        responseObj.savingAccount = accounts[i];
      
      } else if(accounts[i].type == 'credit') {
        responseObj.creditAccount = accounts[i];
      }
    }
    
    res.render('dashboard/transfer', responseObj);

  }).catch((err) => {
    next(err);
  });
});

router.post('/transfer', function(req, res, next){
  const transferAmount = parseFloat(req['body']['transferamount']); //Getting the amount from the user.
  const transferFrom = req['body']['transferfrom']; //Getting the radio choice. 
  var transferTo = req['body']['transferto']; //Getting the radio choice.
  const email = req['body']['email'];

  if (transferTo == 'email') {
    transferTo = email;
    
    // Check if trying to make an external transfer to their own account
    if (email == req.user.email) {
      req.flash('error', 'Cannot make an external transfer to your own account');
      return res.redirect('transfer');
    }
  }
  
  // Check if transferring to the same account
  if (transferFrom === transferTo) {
    req.flash('error', 'Cannot transfer to the same account');
    return res.redirect('transfer');  
  }

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
  var responseObj = {
    checkingAccount: null,
    savingAccount: null,
    creditAccount: null,
    error: req.flash('error')[0]
  }

  Account.getAccounts(req.user._id).then((accounts) => {
    for(var i = 0; i < accounts.length; i++) {
      if(accounts[i].type == 'checking') {
        responseObj.checkingAccount = accounts[i];
      
      } else if(accounts[i].type == 'saving') {
        responseObj.savingAccount = accounts[i];
      
      } else if(accounts[i].type == 'credit') {
        responseObj.creditAccount = accounts[i];
      }
    }

    res.render('dashboard/billpay', responseObj);

  }).catch((err) => {
    next(err);
  });
});

router.post('/billpay', auth.isAuthenticated, function(req, res, next) {
  (async function() {
    var date = new Date();
    
    // Instant
    if (req.body.type === 'instant') {
      date = Date.now() + 2000;
    }
    
    // Scheduled
    else if (req.body.type === 'scheduled') {
      // Check input
      if (isNaN(Date.parse(`${req.body.month} ${req.body.day} ${req.body.year}`))) {
        req.flash('error', 'Invalid Date');
        console.error('Invalid Date');
        return;
      }
      
      // Check date
      date = new Date(`${req.body.month} ${req.body.day} ${req.body.year}`);
      if (date <= Date.now()) {
        req.flash('error', 'Date must be greater than today\'s date');
        console.error('Date must be greater than todays date');
        return;
      }  
    }

    // Check input
    if (req.body.billnumber.length === 0) {
      req.flash('error', 'Bill number required');
      return;
    }
    
    if (isNaN(req.body.payamount) || parseFloat(req.body.payamount) <= 0 || req.body.payamount.length === 0) {
      req.flash('error', 'Amount must be a number greater than 0');
      console.error('invalid amount')
      return;
    }
    
    const userId = req.user._id;
    const accountId = req.body.paywith;
    const billNumber = req.body.billnumber;
    const balance = parseFloat(req.body.payamount);
    const note = (req.body.paynote.length === 0) ? '' : req.body.paynote;

    const billpay = await Billpay.createBillpay(userId, accountId, billNumber, balance, note, date, false);

    return billpay;
  })().then(response => {
    if (response !== undefined && !response.success)
      req.flash('error', response.message);

    res.redirect('billpay');

  }).catch(err => {
    next(err);
  

  });
});

router.get('/deposit', auth.isAuthenticated, function(req, res, next) {
  var responseObj = {
    checkingAccount: null,
    savingAccount: null,
    creditAccount: null,
    error: req.flash('error')[0]
  };

  Account.getAccounts(req.user._id).then((accounts) => {
    for(var i = 0; i < accounts.length; i++) {
      if(accounts[i].type == 'checking') {
        responseObj.checkingAccount = accounts[i];
      
      } else if(accounts[i].type == 'saving') {
        responseObj.savingAccount = accounts[i];
      
      } else if(accounts[i].type == 'credit') {
        responseObj.creditAccount = accounts[i];
      }
    }
    res.render('dashboard/deposit', responseObj);

  }).catch((err) => {
    next(err);
  });
});

router.post('/deposit', auth.isAuthenticated, function(req, res, next) {  
  const type = req.body.type;
  const routing = req.body.routing
  const accountNumber = req.body['account-number'];
  const accountNumberToDepositTo = req.body['deposit-to'];
  const amount = parseFloat(req.body.amount);
  const imgBack = (req.body['img-back'] !== undefined) ? req.body['img-back'] : '';
  const imgFront = (req.body['img-front'] !== undefined) ? req.body['img-front'] : '';

  (async () => {
    
    /* Specific fields Input validation */
    if (type === 'check') {
  
      // We'll assume that some valid routing number has a length between 4 to 7; inclusive
      if (routing.length > 17 || routing.length < 4 || isNaN(routing))
        return req.flash('error', 'Invalid routing number');
  
      // We'll assume bank account numbers are at least 4 digits long
      if (accountNumber.length < 4 || isNaN(accountNumber))
        return req.flash('error', 'Invalid account number')

      if (imgBack.length === 0 || imgFront.length === 0)
        return req.flash('error', 'Check images are required.');
        
      if (imgBack === imgFront)
        return req.flash('error', 'Check images provided cannot be the same.');
        
        
    } else if (type === 'ATM') {
      if (imgFront.length === 0)
        return req.flash('error', 'ATM deposit receipt image is required.');
    }

    /* Common fields input validation */
    if (amount <= 0 || isNaN(amount))
      return req.flash('error', 'Amounts must be greater than 0');
      
    var account = await Account.getAccount(accountNumberToDepositTo);
    if (account === null)
      return req.flash('error', 'Invalid account');
        
    // Deposit amount into account
    await account.deposit(amount);
    return await Transaction.createTransaction(account._id, 'SFG', 'Online Deposit', 'Online SFG deposit', amount, 'Processed');

  })().then(response => {
    res.redirect('deposit');

  }).catch(err => next(err));
});


router.get('/new-account/:accountType', auth.isAuthenticated, function(req, res, next) {
  const accountType = req.params.accountType;

  (async function() {
    var account;
    
    switch (accountType) {
      case 'saving':
        // First check if the user already has the account
        account = await Account.findOne({user_ID: req.user._id, type: 'saving'});
        if (account !== null)
          return null;
          
          account = await Account.createSaving(req.user._id);
          break;
          
      case 'credit':
        // First check if the user already has the account
        account = await Account.findOne({user_ID: req.user._id, type: 'credit'});
        if (account !== null)
          return null;
        
        account = await Account.createCredit(req.user._id, 2000, null);
        break;

      default:
        return null;
        break;
    }

    return account;
  })().then(account => {
    if (account != null)
      res.redirect(`../account/${account._id}`);

    else
      res.redirect(`../`);
  }).catch(err => next(err));
});



/* Export Module */
module.exports = router;