/**
 * contact model module.
 * @module contact
 */

/* Dependencies */
const mongoose = require('mongoose');

/* Schema */
var contactSchema = mongoose.Schema({

});

/* Methods */


/* Statics */

/**
 * Creates a new contact in the DB.
 * @function createContact
 * @param {string} user_ID - The user which the contact will belong to.
 * @param {string} street
 * @param {string} city
 * @param {string} state
 * @param {number} zip
 * @param {number} homeNumber
 * @param {number} mobileNumber
 * @returns {Promise} - Promise object that represents the response.
 */
contactSchema.statics.createContact = function(user_ID, street, city, state, zip, homeNumber, mobileNumber) {

  // Create new contact object based on schema and parameters
  var newContact = this({

  });

  // Check if the user already has a contact document
  // If not, then save the contact object
  // Otherwise, exit

  // Save the contact object

}

/**
 * Retrieves the contact of a user.
 * @function getContact
 * @param {string} user_ID
 * @returns {Promise} - Promise object that represents the response.
 */
contactSchema.statics.getContact = function(user_ID) {

  // Search in DB for the contact document belonging to the user

  // Return the document
}

/* Export Module as a Mongoose Model*/
module.exports = mongoose.model('Contact', contactSchema, 'Contact');