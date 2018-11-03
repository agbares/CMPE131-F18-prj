/**
 * account model module.
 * @module account
 */

/* Dependencies */
const mongoose = require('mongoose');

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
 * Checks whether an account belongs to a user.
 * @function belongsToUser
 * @param {string} user_ID - The user whose ownership of the account is in question.
 * @returns {boolean} - Denotes whether the account belongs to the user.
 */
accountSchema.methods.belongsToUser = function(user_ID) {
  return this.user_ID == user_ID;
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

/* Export Module as a Mongoose Model*/
module.exports = mongoose.model('Account', accountSchema, 'Account');
