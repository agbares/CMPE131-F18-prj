/**
 * transaction model module.
 * @module transaction
 */

/* Dependencies */
const mongoose = require('mongoose');

/* Schema */
var transactionSchema = mongoose.Schema({
account_ID: String,
merchant_Name: String,
type: String,
description: String,
amount: Number,
status: String,
timestamp: Number,

});

/* Methods */


/* Statics */

/**
 * Creates a new Transaction for an account.
 * @function createTransaction
 * @param {string} account_ID
 * @param {string} merchantName
 * @param {string} type
 * @param {string} description
 * @param {string} amount
 * @param {string} status
 * @returns {Promise} - Promise object that represents the response.
 */
transactionSchema.statics.createTransaction = async function(account_ID, merchantName, type, description, amount, status) {

  // Create new contact object based on schema and parameters
  var newTransaction = this({
    account_ID: account_ID,
    merchant_name: merchantName,
    type: type,
    description: description,
    amount: amount,
    status: status,
    timestamp: Date.now()

  });

  // Save the transaction object
  return await newTransaction.save();
}



/**
 * Gets an array of the most recent transactions.
 * @function getTransactions
 * @param {string} account_ID - The account whose transactions will be retrieved.
 * @param {string} quantity - The number of most recent transactions to get.
 * @returns {Promise} - Promise object that represents the response.
 */
transactionSchema.statics.getTransactions = async function(account_ID, quantity) {



  // Search in DB for the n most recent transactions belonging to the account
  // Where n is the quantity supplied.

  // Return the documents
  return await this.find({account_ID: account_ID});
}

/* Export Module as a Mongoose Model*/
module.exports = mongoose.model('Transaction', transactionSchema, 'Transaction');