/**
 * user model module.
 * @module user
 */

/* Dependencies */
const bcrypt = require('bcrypt');
const ObjectID = require('mongodb').ObjectID;
const db = require('../db');
const mongoose = require('mongoose');
const constants = require('../db_config');

const SALTROUNDS = 10;

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

userSchema.methods.generateHash = function(password, callback) {
  const promise = new Promise((resolve, reject) => {
    bcrypt.hash(password, SALTROUNDS).then(function(passHash) {
      // Successful hash
      resolve(passHash);

    }).catch((err) => {
      // Unsuccessful hash
      reject(err);
    });
  });

  // Handle a possible callback function
  if (callback !== undefined) {
    callback = promise.then(callback, callback);
  }

  return promise;
}

userSchema.methods.authenticate = function(password, callback) {
  const promise = new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password).then((res) => {
      // Successful comparison
      resolve(res);

    }).catch((err) => {
      // Unsuccessful comparison
      reject(err);
    });
  });

  // Handle a possible callback function
  if (callback !== undefined) {
    callback = promise.then(callback, callback);
  }

  return promise;
}

module.exports = mongoose.model('User', userSchema, 'User');

// /* Callback Declarations */

// /**
//  * @callback user~creatUserCallback
//  * @param {Error} err - Represents any error that may have occurred during execution. 
//  */

// /**
//  * @callback user~authenticateCallback
//  * @param {Error} err - Represents any error that may have occurred during execution. 
//  * @param {object} res - Cotains info whether the user exists, if the account credentials matches the DB, and user_ID. {exists, isEqual, user_ID}.
//  */

// /**
//  * @callback user~changePasswordCallback
//  * @param {Error} err - Represents any error that may have occurred during execution.
//  * @param {object} res - Contains info whether if the user exists, if it was a successful change {exists, success}.
//  */

// /**
//  * @callback user~updateLastSignOnCallback
//  * @param {Error} err - Represents any error that may have occurred during execution.
//  * @param {bool} exists - Whether the user exists in the DB.
//  */

// /**
//  * @callback user~confirmUserCallback
//  * @param {Error} err - Represents any error that may have occurred during execution.
//  * @param {bool} exists - Whether the user exists in the DB.
//  */

//  /**
//  * @callback user~getUserIDCallback
//  * @param {Error} err - Represents any error that may have occurred during execution.
//  * @param {object} res - Contains info whether the user exists, and their ID. {exists, user_ID}
//  */

//  /**
//  * @callback user~isConfirmedCallback
//  * @param {Error} err - Represents any error that may have occurred during execution.
//  * @param {object} res - Contains info whether the user exists, and if they confirmed their account. {exists, isConfirmed}
//  */

// /* Function Declarations */

/**
 * Creates a new user in the DB.
 * @function user~createUser
 * @param {string} first_name - First name of the user.
 * @param {string} last_name - Last name of the user.
 * @param {string} email - Email of the user.
 * @param {string} password - Plaintext password of the user.
 * @param {number} SSN - SSN of the user.
 * @param {Date} birthdate - Birthdate of the user.
 * @param {creatUserCallback} [callback] - The callback function that handles the response.
 */
// function createUser(first_name, last_name, email, password, SSN, birthdate, callback) {

//   const promise = new Promise(function(resolve, reject) {
//     // Hash the password
//     bcrypt.hash(password, SALTROUNDS).then(function(passHash) {
//       // Successful hashing
    
//       // Create an object to represent the user data
//       userObj = {
//         'first_name' : first_name,
//         'last_name' : last_name,
//         'email' : email,
//         'password' : passHash,
//         'SSN' : SSN,
//         'birthdate' : birthdate,
//         'confirmed_account' : false,
//         'opening_timestamp' : Date.now(),
//         'last_signon_timestamp' : null
//       };

//       // Now let's save the user into the DB
//       db.insertDocument(constants.COLLECTION_USERS, userObj).then(function(res) {
//         // Successful save
//         resolve(null);
//       }).catch(function(err) {
//         // Unsuccessful save
//         reject(err);

//       });
    
//     }).catch(function(err) {
//       // Unsuccessful hasing
//       reject(err);

//       // Don't even attempt to save the data. So let's stop.
//     }); 
//   })

//   // Handle a possible callback function
//   if (callback !== undefined) {
//     callback = promise.then(callback, callback);
//   }

//   return promise;
// }

// /**
//  * Checks a supplied email and password if it matches against the DB.
//  * @function authenticate
//  * @param {string} email - The email of the user.
//  * @param {string} password - The password of the user.
//  * @param {authenticateCallback} [callback] - The callback function that handles the response.
//  * @returns {Promise} - Promise object that represents the response.
//  */
// function authenticate(email, password, callback) {

//   const promise = new Promise(function(resolve, reject) {

//     const query = {email: email};
//     const options = {projection: {password: 1}};
    
//     // Represents information about the user
//     let responseObj = { 
//       exists: null,   // Whether the user exists or not, with the given credentials
//       isEqual: null,  // Whether the password is correct
//       user_ID: null   // The ID of the user in the DB
//     };

//     // Fetch the user from the DB
//     db.fetchAsArray(constants.COLLECTION_USERS, query, options).then(function(arr) {
      
//       // Check if the user exists
//       if (arr.length <= 0) {
//         // User does not exist
//         responseObj['exists'] = false;
//         resolve(responseObj);

//       } else {
//         // User does exist, so let's check the credentials
//         const user = arr[0];
//         const passHash = user['password'];

//         responseObj['exists'] = true;
//         responseObj['user_ID'] = user['_id'];
        
//         // Compare the password against the password from the DB
//         bcrypt.compare(password, passHash).then(function(res) {
//           // res determines whether the password matched or not
//           responseObj['isEqual'] = res;
//           resolve(responseObj);
  
//         }).catch(function(err) {
//           // Error Occurred
//           reject(err);
//         });
//       }
//     }).catch(function(err) {
//       // Error Occurred When fetching the user
//       reject(err);
//     });
//   });

//   if (callback !== undefined) {
//     callback = promise.then(callback.bind(null, null)).catch(callback);
//   }

//   return promise;
// }

// /**
//  * Changes a user's password, given an old password and new password.
//  * @function changePassword
//  * @param {string} user_ID - The user's user_ID.
//  * @param {string} oldPassword - User's old password to be verified against the DB.
//  * @param {string} newPassword - User's new password to save.
//  * @param {changePasswordCallback} [callback] - The callback function that handles the response.
//  * @returns {Promise} Promise object that represents the response.
//  */
// function changePassword(user_ID, oldPassword, newPassword, callback) {
//   const promise = new Promise(function (resolve, reject) {
    
//     // Used to search in the DB
//     const filter = {_id: ObjectID(user_ID)};

//     // Represents data about the change password request
//     let responseObj = {
//       exists: null,
//       success: null
//     };

//     // Retrieve the user's data
//     db.fetchAsArray(constants.COLLECTION_USERS, filter).then(function(arr) {      
//       // Check if the user exists
//       if (arr.length <= 0) {
//         // User does not exist
//         responseObj['exists'] = false;
//         responseObj['success'] = false;
//         resolve(responseObj);

//       } else {
//         // User does exist, so let's check the credentials
//         const user = arr[0];
//         const passHash = user['password'];

//         responseObj['exists'] = true;

//         // Compare the password against the password from the DB
//         bcrypt.compare(oldPassword, passHash).then(function(res) {
//           // Check if the password matches
//           if(!res) {
//             // Password does not match
//             responseObj['success'] = false;
//             resolve(responseObj);

//           } else {
//             // Password does match, so let's hash the password

//             bcrypt.hash(newPassword, SALTROUNDS).then(function(passHash) {
//               // Successful hash, so let's change the password
//               const updateOperation = {$set: {password: passHash}};
//               db.updateOneDocument(constants.COLLECTION_USERS, filter, updateOperation).then(function(res) {
//                 // Successful password change
//                 responseObj['success'] = true;
//                 resolve(responseObj);

//               }).catch(function(err) {
//                 // Unsuccessful update
//                 reject(err);
//               });
//             }).catch(function(err) {
//               // Unsuccessful hash
//               reject(err);
//             });
//           }
//         }).catch(function(err) {
//           // Error Occurred
//           reject(err);
//         });
//       }
//     }).catch(function(err) {
//       // Error occurred fetching the user
//       reject(err);
//     });
//   });

//   // Handle a possible callback function
//   if (callback !== undefined) {
//     callback = promise.then(callback.bind(null, null)).catch(callback);
//   }

//   return promise;
// }

// /**
//  * Updates the user's last_signon_timestamp field
//  * @function updateLastSignOn
//  * @param {string} user_ID - The User's user_ID.
//  * @param {updateLastSignOnCallback} [callback] - The callback function that handles the response.
//  * @returns {Promise} - Promise object that represents the response.
//  */
// function updateLastSignOn(user_ID, callback) {
//   const promise = new Promise(function(resolve, reject) {
//     // Used to search in the DB
//     const filter = {_id: ObjectID(user_ID)};

//     // Fetch the user
//     db.fetchAsArray(constants.COLLECTION_USERS, filter).then(function(arr) {
//       // Check if the user exists
//       if (arr.length <= 0) {
//         // User does not exist
//         resolve(false);
      
//       } else {
//         // User does exist, so update their timestamp
//         const updateQuery = {$set: {last_signon_timestamp: Date.now()}};
//         db.updateOneDocument(constants.COLLECTION_USERS, filter, updateQuery).then(function(res) {
//           // Successful update
//           resolve(true);
//         }).catch(function(err) {
//           // Unsuccessful update
//           reject(err);
//         });
//       }
//     }).catch(function(err) {
//       // Unsuccessful fetch
//       reject(err);
//     });
//   });

//   // Handle a possible callback function
//   if (callback !== undefined) {
//     callback = promise.then(callback.bind(null, null)).catch(callback);
//   }

//   return promise;
// }

// /** 
//  * Updates the User's confirmed_account field
//  * @function confirmUser
//  * @param {string} email - The user's email.
//  * @param {confirmUserCallback} [callback] - The callback function that handles the response.
//  * @returns {Promise} - Promise object that represents the response.
//  */
// function confirmUser(email, callback) {
//   const promise = new Promise(function(resolve, reject) {
//     const filter = {email: email};

//     // Fetch the user
//     db.fetchAsArray(constants.COLLECTION_USERS, filter).then(function(arr) {
//       // Check if the user exists
//       if (arr.length <= 0) {
//         // User does not exist
//         resolve(false);
      
//       } else {
//         // User does exist, so update confirm them
//         const updateQuery = {$set: {confirmed_account: true}};
//         db.updateOneDocument(constants.COLLECTION_USERS, filter, updateQuery).then(function(res) {
//           // Successful update
//           resolve(true);

//         }).catch(function(err) {
//           // Unsuccessful update
//           reject(err);
//         });
//       }
//     }).catch(function(err) {
//       // Unsuccessful fetch
//       reject(err);
//     });
//   });

//   // Handle a possible callback function
//   if (callback !== undefined) {
//     callback = promise.then(callback.bind(null, null)).catch(callback);
//   }

//   return promise;
// }

// /** 
//  * Gets the User's ID.
//  * @function getUserID
//  * @param {string} email - The User's email.
//  * @param {getUserIDCallback} [callback] - The callback function that handles the response.
//  * @returns {Promise} - Promise object that represents the response.
//  */
// function getUserID(email, callback) {
//   const promise = new Promise(function(resolve, reject) {
//     const query = {email: email};

//     db.fetchAsArray(constants.COLLECTION_USERS, query).then(function(arr) {
//       // Successful fetch

//       let responseObj = {
//         exists: null,
//         user_ID: null
//       };

//       // Check if the user exists
//       if (arr.length <= 0) {
//         // User does not exist
//         responseObj['exists'] = false;
//         resolve(responseObj);

//       } else {
//         // User does exist
//         responseObj['exists'] = true;
//         responseObj['user_ID'] = arr[0]['_id'];
//         resolve(responseObj);
//       }
//     }).catch(function(err) {
//       // Unsuccessful fetch
//       reject(err);
//     });
//   });

//   // Handle a possible callback function
//   if (callback !== undefined) {
//     callback = promise.then(callback.bind(null, null)).catch(callback);
//   }

//   return promise;
// }

// /**
//  * Checks whether the user has confirmed their account.
//  * @function isConfirmed
//  * @param {string} email - The user's email
//  * @param {isConfirmedCallback} [callback] - The callback function that handles the response.
//  * @returns {Promise} - Promise object that represents the response.
//  */
// function isConfirmed(email, callback) {
//   const promise = new Promise(function(resolve, reject) {
//     const query = {email: email};

//     db.fetchAsArray(constants.COLLECTION_USERS, query).then(function(arr) {
//       // Successful fetch

//       let responseObj = {
//         exists: null,
//         isConfirmed: null
//       };

//       // Check if the user exists
//       if (arr.length <= 0) {
//         // User does not exist
//         responseObj['exists'] = false;
//         resolve(responseObj);

//       } else {
//         // User does exist
//         responseObj['exists'] = true;
//         responseObj['isConfirmed'] = arr[0]['confirmed_account'];
//         resolve(responseObj);
//       }
//     }).catch(function(err) {
//       // Unsuccessful fetch
//       reject(err);
//     });
//   });

//   // Handle a possible callback function
//   if (callback !== undefined) {
//     callback = promise.then(callback.bind(null, null)).catch(callback);
//   }

//   return promise;
// }

// module.exports = {
//   createUser,
//   authenticate,
//   changePassword,
//   updateLastSignOn,
//   confirmUser,
//   getUserID,
//   isConfirmed
// };