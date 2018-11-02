/**
 * account model module.
 * @module account
 */

/* Dependencies */
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
