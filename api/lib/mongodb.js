// lib/mongodb.js
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI; // store it in .env
const options = {};

let client;
let clientPromise;

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

client = new MongoClient(uri, options);
clientPromise = client.connect();

module.exports = clientPromise;
