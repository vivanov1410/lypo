'use strict';

var Account = require('./account.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function (res, err) {
  return res.json(422, err);
};

/**
 * Creates a new account
 */
exports.create = function (req, res, next) {
  var newAccount = new Account(req.body);
  newAccount.provider = 'local';
  newAccount.save(function (err, account) {
    if(err) return validationError(res, err);
    var token = jwt.sign({ _id: account._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

// /**
//  * Get a single user
//  */
// exports.show = function (req, res, next) {
//   var userId = req.params.id;

//   User.findById(userId, function (err, user) {
//     if (err) return next(err);
//     if (!user) return res.send(401);
//     res.json(user.profile);
//   });
// };

// /**
//  * Deletes a user
//  * restriction: 'admin'
//  */
// exports.destroy = function(req, res) {
//   User.findByIdAndRemove(req.params.id, function(err, user) {
//     if(err) return res.send(500, err);
//     return res.send(204);
//   });
// };

// *
//  * Change a users password
 
// exports.changePassword = function(req, res, next) {
//   var userId = req.user._id;
//   var oldPass = String(req.body.oldPassword);
//   var newPass = String(req.body.newPassword);

//   User.findById(userId, function (err, user) {
//     if(user.authenticate(oldPass)) {
//       user.password = newPass;
//       user.save(function(err) {
//         if (err) return validationError(res, err);
//         res.send(200);
//       });
//     } else {
//       res.send(403);
//     }
//   });
// };

/**
 * Get my info
 */
exports.me = function (req, res, next) {
  console.log(req.account, req.user);
  var accountId = req.account._id;
  Account.findOne({
    _id: accountId
  }, '-salt -hashedPassword', function (err, account) {
    if(err) return next(err);
    if(!account) return res.json(401);
    res.json(account);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function (req, res, next) {
  res.redirect('/');
};