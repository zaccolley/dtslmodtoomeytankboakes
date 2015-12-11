require('dotenv').load(); // get .env values

/* Allow console.logs in this file */
/* eslint-disable no-console */

import cradle from 'cradle';

export const options = {
  database: 'webres',
  cache: true,
  raw: false,
  forceSave: true
};

// if username and password set for couchdb
if (process.env.COUCHDB_USERNAME && process.env.COUCHDB_PASSWORD) {
  // add auth the db options
  options.auth = {
    username: process.env.COUCHDB_USERNAME,
    password: process.env.COUCHDB_PASSWORD
  };
}

cradle.setup(options);

const connection = new cradle.Connection;
console.log(` 💺  CouchDB server is now running on http://localhost:5984`);
export const db = connection.database(options.database);
