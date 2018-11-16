/**
 * account route that defines account logic.
 * @module account
 */

/* Dependencies */
var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
var Account = require('../models/account');

/* Routes */
router.get('/:accountId', auth.isAuthenticated, auth.accountBelongsToUser, function(req, res, next) {
  const accountId = req.params.accountId;

  Account.getAccount(accountId).then((account) => {
    res.render('dashboard/account', { account : account});
    
  }).catch((err) => {
    next(err);
  });
});

// router.post('/', function(req, res, next){
//   const transferAmount = req['body']['transferamount']; //Getting the amount from the user.
//   const transferFrom = req['body']['transferfrom']; //Getting the radio choice. 
//   const transferTo = req['body']['transferto']; //Getting the radio choice. 
//   var checkingsAccount = 0;
//   var savingsAccount = 0;

//   if(transferFrom == 'Checking' && transferTo == 'Saving')
//   {
//       if(validAmount(transferAmount) == true){
//           Account.find({user_ID: req.user._id}, function(err, accounts){
//             if(err){
//               console.log(err);
//             }
//             console.log(accounts);

//             for(var i = 0; i < accounts.length; i++)
//             {
//               if(accounts[i].type == 'checking'){
//                 //checkingsAccount = accounts[i];
//                 for(var j = 0; j < accounts.length; j++){
//                   if(accounts[j].type == 'savings'){
//                     accounts[i] = checkingsAccount - transferAmount;
//                     accounts[j] = savingsAccount + transferAmount;

//                     // savingsAccount = accounts[j]
//                     // checkingsAccount -= transferAmount;
//                     // savingsAccount += transferAmount;
//                     // accounts[i] = checkingsAccount;
//                     // accounts[j] = savingsAccount;
//                   }
//                   else{
//                     console.log('No Accounts');
//                   }
//                 }
//               }
//               else{
//                 console.log('No Accounts');
//               }
//             }
//           })
//       }
//   }
// })

// function validAmount(amount){ //Helper function to see if the user put in a positive amount. 
//   if(amount > 0){
//     return true;
//   }
//   else{
//     return false;
//   }
// }

// function transferMoney(checkingsAmount, savingsAmount, creditAmount, temp_transfer_amount, temp_transfer_from, temp_transfer_to){
//   Account.find({user_ID: req.user._id}, function(err, accounts){
//     if(err){
//       console.log(err);
//     }
//     console.log(accounts);
//     //if(temp_transfer_from == 'Checking' && temp_transfer_to == 'Saving')
//     for(var i = 0; i < accounts.length; i++){
//       if(accounts[i].type == 'checking'){
//         for(var j = 0; j < accounts.length; j++){
//           if(accounts[j].type == 'savings'){
//             accounts[i] = checkingsAmount - temp_transfer_amount;
//             accounts[j] = savingsAmount + temp_transfer_amount;
//           }
//           else{
//             console.log('No Accounts');
//           }
//         }
//       }
//       else{
//         console.log('No Accounts');
//       }
//     }
//   })
// }


 /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

 router.post('/', function(req, res, next){
  const transferAmount = req['body']['transferamount']; //Getting the amount from the user.
  const transferFrom = req['body']['transferfrom']; //Getting the radio choice. 
  const transferTo = req['body']['transferto']; //Getting the radio choice. 
  var checkingsAccount = 0;
  var savingsAccount = 0;

  if(transferFrom == 'Checking' && transferTo == 'Saving')
  {
    if(validAmount(transferAmount) == true){
      checking_to_saving(transferAmount);
    }
  }
  else if (transferFrom == 'Checking' && transferTo == 'Credit')
  {
    if(validAmount(transferAmount) == true){
      checking_to_credit(transferAmount);
    }
  }
  else if (transferFrom == 'Saving' && transferTo == 'Checking')
  {
    if(validAmount(transferAmount) == true){
      saving_to_checking(transferAmount);
    }
  }
  else if (transferFrom == 'Saving' && transferTo == 'Credit'){
    if(validAmount(transferAmount) == true){
      saving_to_credit(transferAmount);
    }
  }
  else
  {
    console.log('Error');
  }
})

function validAmount(amount){ //Helper function to see if the user put in a positive amount. 
  if(amount > 0){
    return true;
  }
  else{
    return false;
  }
}

function checking_to_saving(temp_transfer_amount){
  Account.find({user_ID: req.user._id}, function(err, accounts){
    if(err){
      console.log(err);
    }
    console.log(accounts);
    for(var i = 0; i < accounts.length; i++){
      if(accounts[i].type == 'checking'){
        for(var j = 0; j < accounts.length; j++){
          if(accounts[j].type == 'savings'){
            accounts[i] -= temp_transfer_amount;
            accounts[j] += temp_transfer_amount;
          }
          else{
            console.log('No Accounts');
          }
        }
      }
      else{
        console.log('No Accounts');
      }
    }
  })
}

function checking_to_credit(temp_transfer_amount){
  Account.find({user_ID: req.user._id}, function(err, accounts){
    if(err){
      console.log(err);
    }
    console.log(accounts);
    for(var i = 0; i < accounts.length; i++){
      if(accounts[i].type == 'checking'){
        for(var j = 0; j < accounts.length; j++){
          if(accounts[j].type == 'credit'){
            accounts[i] -= temp_transfer_amount;
            accounts[j] += temp_transfer_amount;
          }
          else{
            console.log('No Accounts');
          }
        }
      }
      else{
        console.log('No Accounts');
      }
    }
  })
}

function saving_to_checking(temp_transfer_amount){
  Account.find({user_ID: req.user._id}, function(err, accounts){
    if(err){
      console.log(err);
    }
    console.log(accounts);
    for(var i = 0; i < accounts.length; i++){
      if(accounts[i].type == 'saving'){
        for(var j = 0; j < accounts.length; j++){
          if(accounts[j].type == 'checking'){
            accounts[i] -= temp_transfer_amount;
            accounts[j] += temp_transfer_amount;
          }
          else{
            console.log('No Accounts');
          }
        }
      }
      else{
        console.log('No Accounts');
      }
    }
  })
}

function saving_to_credit(temp_transfer_amount){
  Account.find({user_ID: req.user._id}, function(err, accounts){
    if(err){
      console.log(err);
    }
    console.log(accounts);
    for(var i = 0; i < accounts.length; i++){
      if(accounts[i].type == 'saving'){
        for(var j = 0; j < accounts.length; j++){
          if(accounts[j].type == 'credit'){
            accounts[i] -= temp_transfer_amount;
            accounts[j] += temp_transfer_amount;
          }
          else{
            console.log('No Accounts');
          }
        }
      }
      else{
        console.log('No Accounts');
      }
    }
  })
}

/* Export Module */
module.exports = router;