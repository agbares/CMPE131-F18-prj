/**
 * db module that creates some helpful wrapper functions to communicate
 * with the database.
 * @module db
 */

/* Dependencies */
var MongoClient = require('mongodb').MongoClient;
const constants = require('./db_config');

// Refers to the Mongo DB
const URI = `mongodb+srv://${constants.DB_USER}:${constants.DB_PASSWORD}@${constants.DB_HOST}`;

// This variable saves a MongoDB Client session
var dbClient = null;

// This variable tracks if the dbClient session is being currently used by more than one method
var dbAccessCount = 0;

/* Callback Declarations */

/**
 * @callback db~connectCallback
 * @param {Error} err - Represents any error that may have occurred during execution.
 * @param {Db} database - Represents a MongoDB Db object.
 */

/**
 * @callback db~disconnectCallback
 * @param {Error} err - Represents any error that may have occurred during execution.
 */

/**
 * @callback db~getCollectionCallback
 * @param {Error} err - Represents any error that may have occurred during execution.
 * @param {Collection} collection - Represents a MongoDB Collection object.
 */

/**
 * @callback db~fetchAsArrayCallback
 * @param {Error} err - Represents any error that may have occurred during execution.
 * @param {array} arr - Represents an array of fetched MongoDB documents.
 */

 /**
 * @callback db~insertDocumentCallback
 * @param {Error} err - Represents any error that may have occurred during execution.
 * @param {Collection~insertOneWriteOpResult} res - Represents the result of the document write. See: http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#~insertOneWriteOpResult.
 */

 /**
 * @callback db~deleteOneDocumentCallback
 * @param {Error} err - Represents any error that may have occurred during execution.
 * @param {Collection~deleteWriteOpResult} res - Represents the result of the document deletion. See: http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#~deleteWriteOpResult.
 */

 /**
 * @callback db~deleteManyDocumentsCallback
 * @param {Error} err - Represents any error that may have occurred during execution.
 * @param {Collection~deleteWriteOpResult} res - Represents the result of the documents deletion. See: http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#~deleteWriteOpResult.
 */

 /**
 * @callback db~updateOneDocumentCallback
 * @param {Error} err - Represents any error that may have occurred during execution.
 * @param {Collection~updateWriteOpResult} res - Represents the result of the document update. See: http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#~updateWriteOpResult.
 */

/* Function Declarations */

/**
 * Connects to a MongoDB database.
 * @function db~connect
 * @param {connectCallback} [callback] - The callback function that handles the response.
 * @returns {Promise} - Promise object represents the Mongo Db object.
 */
function connect(callback) {
    // Create a new Promise object
  const promise = new Promise(function(resolve, reject) {

    // If there isn't a DB session yet, let's create one
    if (dbClient === null) {

      // Attempt to connect to the database
      MongoClient.connect(URI).then(function(client) {
        // Successfully connected
        console.log("db Module: Connected to DB");

        dbClient = client;
        dbAccessCount++;

        resolve(client.db(constants.DB_NAME));
      }).catch(function(err) {
        // Unsuccessful connection
        reject(err);

        console.log(err);
      });

    } else {
      // DB session already exists, so lets increment the tracker
      dbAccessCount++;
    }
  });

  // If the programmer supplies a callback function use it
  if (callback !== undefined) {
    callback = promise.then(callback.bind(null, null)).catch(callback);
  }

  // Otherwise return the promise
  return promise;
}

/**
 * Closes an existing connection to a MongoDB database.
 * @function db~disconnect
 * @param {disconnectCallback} [callback] - The callback function that handles the response.
 * @returns {Promise} - Promise object represents the response.
 */
function disconnect(callback) {
  const promise = new Promise(function(resolve, reject) {
    
    if (dbClient === null) {
      reject('ERROR: Attempted to disconnect from the database in db~disconnect() without existing MongoDB Client Session.');
    
    } else if (dbAccessCount == 1) {
      // Only one method is using the dbClient session, so it's safe to close the session now
      
      dbClient.close();
      console.log("db Module: Disconnected from DB");

      dbClient = null;
      resolve(null);

    } else {
      // There are still more than 1 method using the session, so leave it alone.

      resolve(null);
    }

  });

  // Handle a possible callback function
  if (callback !== undefined) {
    callback = promise.then(callback).catch(callback);
  }
  
  return promise;
}

/**
 * Gets a MongoDB Collection.
 * @function db~getCollection
 * @param {string} collectionName - The name of the requested collection.
 * @param {getCollectionCallback} [callback] - The callback function that handles the response.
 * @returns {Promise} - Promise object represents the Mongo Db object.
 */
// function getCollection(collectionName, callback) {

//   const promise = new Promise(function(resolve, reject) {
//     connect().then(function(database) {
//       resolve(database.collection(collectionName));
//     }).catch(function(err) {
//       reject(err);
//     });
//   });

//   // If the programmer supplies a callback function use it
//   if (callback !== undefined) {
//     callback = promise.then(callback.bind(null, null)).catch(callback);
//   }

//   // Otherwise return the promise
//   return promise;

//   // connect(function(err, db) {
//   //     if (err) {
//   //         return callback(err);
//   //     }

//   //     return callback(null, db.collection(collectionName));
//   // });
// }

/**
 * Fetches document(s) from a MongoDB Collection as an array.
 * @function db~fetchAsArray
 * @param {string} collectionName - The name of the requested collection.
 * @param {object} query - Query to fetch from the collection.
 * @param {object} options - Optional settings. For options, see: http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#find.
 * @param {fetchAsArrayCallback} [callback] - The callback function that handles the response.
 * @returns {Promise} - Promise object represents the array of documents
 */
function fetchAsArray(collectionName, query, options, callback) {
  const promise = new Promise(function(resolve, reject) {
    
    // Connect to the database
    connect().then(function(database) {
      // Successful Connection

      database.collection(collectionName).find(query, options).toArray().then((documents) => {
        // Successful search

        // Return the found documents as an array
        resolve(documents);
        disconnect();

      }).catch((err) => {
        // Error occurred when searching from the collection
        reject(err);
        disconnect();

      });
    }).catch(function(err) {
      // Unsuccessful Connection
      reject(err);
    });
  });

  // Handle a possible callback function
  if (callback !== undefined) {
    callback = promise.then(callback.bind(null, null)).catch(callback);
  }

  return promise;
}

/**
 * Inserts an object into a MongoDB Collection as a new Document.
 * @function insertDocument
 * @param {string} collectionName - The name of the target collection.
 * @param {object} object - Object to store into the collection as a new document.
 * @param {insertDocumentCallback} [callback] - The callback function that handles the response.
 * @returns {Promise} - Promise object that represents the response.
 */
function insertDocument(collectionName, object, callback) {
  const promise = new Promise(function(resolve, reject) {

    // Connect to the database
    connect().then(function(database) {
      // Successful connection

      // Reference to MongoDB Collection
      const collection = database.collection(collectionName);
      
      // Write object to collection
      collection.insertOne(object).then(function(res) {
        // Successful write
        resolve(res);
        disconnect();

      }).catch(function(err) {
        // Unsuccessful write
        reject(err);
        disconnect();
      });
    }).catch(function(err) {
      // Unsuccessful Conection
      reject(err);
    });
  });

  // Handle a possible callback function
  if (callback !== undefined) {
    callback = promise.then(callback.bind(null, null)).catch(callback);
  }

  return promise;
}

/**
 * Deletes a Document from a MongoDB Collection
 * @function deleteOneDocument
 * @param {string} collectionName - The name of the target collection.
 * @param {object} filter - The filter used to select the document to remove.
 * @param {deleteOneDocumentCallback} [callback] - The callback function that handles the response.
 * @returns {Promise} - Promise object that represents the response.
 */

function deleteOneDocument(collectionName, filter, callback) {
  const promise = new Promise(function(resolve, reject) {
    // Connect to the database
    connect().then(function(database) {
      // Successful connection

      // Reference to MongoDB Collection
      const collection = database.collection(collectionName);

      // Delete document from collection
      collection.deleteOne(filter).then(function(res) {
        // Successful deletion
        resolve(res);
        disconnect();

      }).catch(function(err) {
        // Unsuccessful deletion
        reject(err);
        disconnect();

      });
    }).catch(function(err) {
      // Unsuccessful connection
      reject(err);
    });
  });

  // Handle a possible callback function
  if (callback !== undefined) {
    callback = promise.then(callback.bind(null, null)).catch(callback);
  }

  return promise;
}

/**
 * Deletes many Documents from a MongoDB Collection
 * @function deleteManyDocuments
 * @param {string} collectionName - The name of the target collection.
 * @param {object} filter - The filter used to select the documents to remove.
 * @param {deleteManyDocumentsCallback} [callback] - The callback function that handles the response.
 * @returns {Promise} - Promise object that represents the response.
 */

function deleteManyDocuments(collectionName, filter, callback) {
  const promise = new Promise(function(resolve, reject) {
    // Connect to the database
    connect().then(function(database) {
      // Successful connection

      // Reference to MongoDB Collection
      const collection = database.collection(collectionName);

      // Delete document from collection
      collection.deleteMany(filter).then(function(res) {
        // Successful deletion
        resolve(res);
        disconnect();

      }).catch(function(err) {
        // Unsuccessful deletion
        reject(err);
        disconnect();

      });
    }).catch(function(err) {
      // Unsuccessful connection
      reject(err);
    });
  });

  // Handle a possible callback function
  if (callback !== undefined) {
    callback = promise.then(callback.bind(null, null)).catch(callback);
  }

  return promise;
}

/**
 * Updates one document in a MongoDB Collection.
 * @function updateOneDocument
 * @param {string} collectionName - The name of the target collection.
 * @param {object} filter - The filter used to select the document to update.
 * @param {object} update - The update operations to be applied to the document.
 * @param {updateOneDocumentCallback} [callback] - The callback function that handles the response.
 * @returns {Promise} - Promise Object that represents the response.
 */
function updateOneDocument(collectionName, filter, update, callback) {
  const promise = new Promise(function(resolve, reject) {
    // Connect to the database
    connect().then(function(database) {
      // Successful connection

      // Reference to MongoDB Collection
      const collection = database.collection(collectionName);

      collection.updateOne(filter, update).then(function(res) {
        // Successful update
        resolve(res);
        disconnect();

      }).catch(function (err) {
        // Unsuccessful update
        reject(err);
        disconnect();

      });
    }).catch(function(err) {
      // Unsuccessful connection
      reject(err);
    });
  });

  // Handle a possible callback function
  if (callback !== undefined) {
    callback = promise.then(callback.bind(null, null)).catch(callback);
  }

  return promise;
}

module.exports = {
  fetchAsArray,
  insertDocument,
  deleteOneDocument,
  deleteManyDocuments,
  updateOneDocument
};