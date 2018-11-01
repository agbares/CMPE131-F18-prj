/**
 * user model module.
 * @module user
 */

/* Dependencies */
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const SALTROUNDS = 10;

/* Schema */
var userSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  SSN: Number,
  birthdate: Number,
  confirmed_account: Boolean,
  opening_timestamp: Number,
  last_signon_timestamp: Number
});

/* Methods */

/**
 * Checks whether a given password matches the user's actual password.
 * @function authenticate
 * @param {string} password - The password of the user.
 * @returns {Promise} - Promise object that represents the response.
 */
userSchema.methods.authenticate = async function(password) {
  return await bcrypt.compare(password, this.password);
}

/**
 * Changes a user's password, given an old password and new password.
 * @function changePassword
 * @param {string} oldPassword - User's old password to be verified against the DB.
 * @param {string} newPassword - User's new password to save.
 * @returns {Promise} Promise object that represents the response.
 */
userSchema.methods.changePassword = async function(oldPassword, newPassword) {
  
  var isCorrectPassword = await this.authenticate(oldPassword);
  
  if (!isCorrectPassword) {
    return false;
  }

  var passHash = await userSchema.statics.generateHash(newPassword);
  this.password = passHash;

  return this.save();
}

/**
 * Updates the user's last_signon_timestamp field.
 * @function updateLastSignOn
 * @returns {Promise} - Promise object that represents the response.
 */
userSchema.methods.updateLastSignOn = async function() {
  this.last_signon_timestamp = Date.now();
  return await this.save();
}

/** 
 * Updates the User's confirmed_account field to true.
 * @function confirmUser
 * @returns {Promise} - Promise object that represents the response.
 */
userSchema.methods.confirmUser = async function() {
  this.confirmed_account = true;
  return await this.save();
}

/* Statics */

/**
 * Generates a hashed password.
 * @function generateHash
 * @returns {Promise} - Promise object that represents the response.
 */
userSchema.statics.generateHash = async function(password) {
  return await bcrypt.hash(password, SALTROUNDS);
}

/**
 * Creates a new user in the DB.
 * @function createUser
 * @param {User} newUser - The new user to save.
 */
userSchema.statics.createUser = async function(newUser) {

  var user = await this.findOne({email: newUser.email});
  
  if (user) {
    return false;
  }

  var passHash = await this.generateHash(newUser.password);
  newUser.password = passHash;

  return await newUser.save();;
}

/* Export Module as a Mongoose Model*/
module.exports = mongoose.model('User', userSchema, 'User');