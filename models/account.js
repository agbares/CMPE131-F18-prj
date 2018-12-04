/**
 * account model module.
 * @module account
 */

/* Dependencies */
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const randomstring = require('randomstring');
const uniqueValidator = require('mongoose-unique-validator');
const User = require('./user');
const Transaction = require('./transaction');

/* Constants */
const MAX_RETRIES = 5;


/* Schema */
var accountSchema = mongoose.Schema({
    _id: String,
    user_ID: String,
    type: String,
    balance: Number,
    minimum_due: Number,
    limit: Number,
    payment_date: Number
});

/* Plugins */
accountSchema.plugin(uniqueValidator);

/* Methods */

/**
 * Deposits an amount to an account's balance.
 * @function deposit
 * @param {Number} amount - Amount to be deposited.
 * @returns {Promise} - Promise object that represents the response.
 */
accountSchema.methods.deposit = async function(amount) {
  if (amount < 0)
    return Promise.reject(new Error('Amount deposited must be a value greater than or equal to 0'));

  this.balance += amount;
  return await this.save();
}

/**
 * Deducts an amount from an account's balance.
 * @function deduct
 * @param {Number} amount - Amount to be deducted.
 * @returns {Promise} - Promise object that represents the response.
 */
accountSchema.methods.deduct = async function(amount) {
  if (amount < 0)
    return Promise.reject(new Error('Amount deducted must be a value greater than or equal to 0'));

  this.balance -= amount;
  return await this.save();
}

/* Statics */

/**
 * Creates a new account.
 * @function createAccount
 * @param {ObjectID} user_ID
 * @param {String} type
 * @param {String} balance
 * @param {Number} minimumDue
 * @param {Number} limit
 * @param {Number} paymentDate
 * @returns {Promise}
 */
accountSchema.statics.createAccount = async function(user_ID, type, balance, minimumDue, limit, paymentDate) {
  var newAccount = this({
    _id: randomstring.generate({length: 12, charset: 'numeric'}),
    user_ID: user_ID,
    type: type,
    balance: balance,
    minimum_due: minimumDue,
    limit: limit,
    payment_date: paymentDate
  });

  return await newAccount.save();
}

/**
 * Creates a new checking account.
 * @function createChecking
 * @param {ObjectID} user_ID
 * @returns {Promise}
 */
accountSchema.statics.createChecking = async function(user_ID) {

  var promise = Promise.reject();
  for(var i = 0; i < MAX_RETRIES; i++)
    promise = promise.catch(() => {return this.createAccount(user_ID, 'checking', 0, null, null, null)});
  
  return await promise.then((res) => {return res}).catch((res) => {return Promise.reject(res)});
}

/**
 * Creates a new saving account.
 * @function createSaving
 * @param {ObjectID} user_ID
 * @returns {Promise}
 */
accountSchema.statics.createSaving = async function(user_ID) {

  var promise = Promise.reject();
  for(var i = 0; i < MAX_RETRIES; i++)
    promise = promise.catch(() => {return this.createAccount(user_ID, 'saving', 0, null, null, null)});
  
  return await promise.then((res) => {return res}).catch((res) => {return Promise.reject(res)});
}

/**
 * Creates a new credit account.
 * @function createCredit
 * @param {ObjectID} user_ID
 * @param {Number} limit
 * @param {Number} paymentDate
 * @returns {Promise}
 */
accountSchema.statics.createCredit = async function(user_ID, limit, paymentDate) {

  var promise = Promise.reject();
  for(var i = 0; i < MAX_RETRIES; i++)
    promise = promise.catch(() => {return this.createAccount(user_ID, 'credit', 0, 0, limit, paymentDate)});

  return await promise.then((res) => {return res}).catch((res) => {return Promise.reject(res)});
}

/**
 * Gets the account information of a specificed account ID.
 * @function getAccount
 * @param {string} account_ID - The ID of the requested account.
 * @returns {Promise} - Promise object that represents the response.
 */
accountSchema.statics.getAccount = async function(account_ID) {
  return await this.findOne({_id: account_ID});
}

/**
 * Gets all the accounts belonging to a user.
 * @function getAccounts
 * @param {string} user_ID - The user whose accounts will be retrieved.
 * @returns {Promise} - Promise object that represents the response.
 */
accountSchema.statics.getAccounts = async function(user_ID) {
  return await this.find({user_ID: user_ID});
}

/**
 * Checks whether an account belongs to a user.
 * @function belongsToUser
 * @param {string} account_ID - The ID of the account in question.
 * @param {string} user_ID - The user whose ownership of the account is in question.
 * @returns {boolean} - Denotes whether the account belongs to the user.
 */
accountSchema.statics.belongsToUser = async function(account_ID, user_ID) {
  if (await this.findOne({_id: account_ID, user_ID: user_ID}) == null)
    return false;

  return true;
}

/**
 * Transfers an amount from one account to another. Does not allow transfer amounts greater than the
 * balance available in the from account.
 * @function transfer
 * @param {string} from - The ID of the source account.
 * @param {string} to - The ID of the destination account.
 * @param {number} amount - The amount to transfer.
 * @returns {Promise}
 */
accountSchema.statics.transfer = async function(from, to, amount) {
  // Response object
  var response = {
    from: null,
    to: null,
    errorMessage: null
  };

  // Check for valid amount
  if (amount <= 0) {
    response.errorMessage = 'Amount must be greater than 0.'
    return response;
  }

  // Fetch accounts
  const fromAccount = await this.findOne({_id: from});
  var toAccount;

  if (!isNaN(to)) {
    // This account is from an account ID
    toAccount = await this.findOne({_id: to});

  } else {
    // Fetch checkings account from user
    
    // This account is from an email
    const externalUser = await User.getUser(to);
    
    // User does not exist
    if (externalUser === null) {
      response.errorMessage = 'Account with email: ' + to + ' does not exist';
      return response;
    }

    // Fetch the checkings
    toAccount = await this.findOne({user_ID: externalUser._id, type: 'checking'});
  }

  // Check if accounts exist
  if (fromAccount === null || toAccount === null) {
    response.errorMessage = 'Account does not exist';
    return response;
  }

  // Check for valid amount
  if (amount > fromAccount.balance) {
    response.errorMessage = 'Amount is greater than the available balance.';
    return response;
  }

  // Check for valid amount if paying off a credit card
  if (amount > toAccount.balance) {
    response.errorMessage = 'Amount is greater than the credit balance';
    return response;
  }

  // Make the transfer
  response.from = await fromAccount.deduct(amount);
  
  if (toAccount.type === 'credit')
    response.to = await toAccount.deduct(amount);
    
  else
    response.to = await toAccount.deposit(amount);
    
  // Mask the first 6 digits of the accounts
  const fromID = response.from._id.replace(response.from._id.substring(0, response.from._id.length / 2), "xxxxxx");
  const toID = response.to._id.replace(response.to._id.substring(0, response.to._id.length / 2), "xxxxxx");

  await Transaction.createTransaction(response.from._id, response.to._id, 'Transfer', `Money transfer to ${toID}`, (amount * -1), 'Processed');
  await Transaction.createTransaction(response.to._id, response.from._id, 'Transfer', `Money transfer from ${fromID}`, amount, 'Processed');

  return response;
}

/* Export Module as a Mongoose Model*/
module.exports = mongoose.model('Account', accountSchema, 'Account');
