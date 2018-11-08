/**
 * Authentication middleware module.
 * @module auth
 */

/* Dependencies */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Account = require('../models/account');

/**
 * Checks whether a user is authenticated.
 * @function isAuthenticated
 * @param {Request} req - Represents the client request.
 * @param {Response} res - Represents the server's response.
 * @param {NextFunction} next - The next controller in the chain.
 */
function isAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }

  next();
}

/**
 * Checks whether the account from the request belongs to the user.
 * @function accountBelongsToUser
 * @param {Request} req - Represents the client request.
 * @param {Response} res - Represents the server's response.
 * @param {NextFunction} next - The next controller in the chain.
 */
function accountBelongsToUser(req, res, next) {
  if (req.params.accountId === undefined)
    return next(new Error('Call to accountBelongsToUser expects an accountId request parameter'));

  Account.belongsToUser(req.params.accountId, req.user._id).then((belongsToUser) => {
    if (!belongsToUser)
      return res.redirect('/dashboard');
    
    // Account does belong to user, so pass control to next controller.
    next();
    
  }).catch((err) => {
    next(err);
  });
}

module.exports = {
  isAuthenticated,
  accountBelongsToUser
 };