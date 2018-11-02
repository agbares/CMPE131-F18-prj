/**
 * transaction model module.
 * @module transaction
 */

/* Dependencies */
const mongoose = require('mongoose');

/* Schema */
var transactionSchema = mongoose.Schema({

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

  });

  // Save the transaction object
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
}

/* Export Module as a Mongoose Model*/
module.exports = mongoose.model('Transaction', transactionSchema, 'Transaction');