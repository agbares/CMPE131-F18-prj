/**
 * account model module.
 * @module account
 */

/* Dependencies */
const bcrypt = require('bcrypt');
const ObjectID = require('mongodb').ObjectID;
const db = require('../db');
const constants = require('../db_config');
const mongoose = require('mongoose');

var accountSchema = mongoose.Schema({
    user_ID: String,
    type: String,
    balance: Number,
    minimum_due: Number,
    limit: Number,
    payment_date: Number
});

module.exports = mongoose.model('Account', accountSchema, 'Account');