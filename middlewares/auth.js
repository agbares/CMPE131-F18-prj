/**
 * Authentication middleware module.
 * @module auth
 */

/* Dependencies */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/**
 * Checks whether a user is authenticated.
 * @function isAuthenticated
 * @param {Request} req - Represents the client request.
 * @param {Response} res - Represents the server's response.
 * @param {NextFunction} next - The next controller in the chain.
 * @returns [{NextFunction}] - The next controller in the chain.
 */
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
}

module.exports = {
  isAuthenticated
 };