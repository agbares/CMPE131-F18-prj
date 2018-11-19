/**
 * account model module.
 * @module account
 */

/* Dependencies */
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;

/* Schema */
var accountSchema = mongoose.Schema({
    user_ID: String,
    type: String,
    balance: Number,
    minimum_due: Number,
    limit: Number,
    payment_date: Number
});

/* Methods */

/**
 * Deposits an amount to an account's balance.
 * @function deposit
 * @param {Number} amount - Amount to be deposited.
 * @returns {Promise} - Promise object that represents the response.
 */
accountSchema.methods.deposit = async function(amount) {
  this.balance += amount;
  return await this.save();
}

/* Statics */

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

  // Check validity of IDs
  if (!ObjectID.isValid(from) || !ObjectID.isValid(to)) {
    response.errorMessage = 'Invalid account ID';
    return response;
  }

  // Fetch accounts
  const fromAccount = await this.findOne({_id: from});
  const toAccount = await this.findOne({_id: to});

  // Check if accounts exist
  if (fromAccount === null || toAccount === null) {
    response.errorMessage = 'Account does not exist';
    return response;
  }

  // Check for valid amount
  if (amount > fromAccount.balance) {
    response.errorMessage = 'Amount is greater than the available balance.'
    return response;
  }

  // Make the transfer
  response.from = await fromAccount.deposit(amount * -1);
  response.to = await toAccount.deposit(amount);

  return response;
}

/* Export Module as a Mongoose Model*/
module.exports = mongoose.model('Account', accountSchema, 'Account');
