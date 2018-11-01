/**
 * billpay model module.
 * @module billpay
 */

/* Dependencies */
const mongoose = require('mongoose');

/* Schema */
var billpaySchema = mongoose.Schema({

});

/* Methods */


/* Statics */

/**
 * Creates a new billpay in the DB.
 * @function createBillPay
 * @param {string} user_ID - The user which the billpay belongs to.
 * @param {string} account_ID - The user's account which the billpay belongs to.
 * @param {string} merchantName
 * @param {string} balance
 * @param {string} recurrentDate
 * @returns {Promise} - Promise object that represents the response.
 */
billpaySchema.statics.createBillPay = function(user_ID, account_ID, merchantName, balance, recurrentDate) {

  // Create new billpay object based on schema and parameters
  var newBillpay = this({

  });

  // Save the billpay object

}

/**
 * Retrieves an array of all the billpay that belongs to a user.
 * @function getAllBillPay
 * @param {string} user_ID - The user which the billpay belongs to.
 * @returns {Promise} - Promise object that represents the response.
 */
billpaySchema.statics.getAllBillPay = function(user_ID) {

  // Search in DB for all billpay documents belonging to the user


  // Return the documents
}

/* Export Module as a Mongoose Model*/
module.exports = mongoose.model('Billpay', billpaySchema, 'Billpay');