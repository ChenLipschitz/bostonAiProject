/**
 * MongoDB Connection Module
 * 
 * This file contains the code to connect to MongoDB.
 * When MongoDB is available, replace the code in server.js with this implementation.
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/local';
const collectionName = process.env.COLLECTION_NAME || 'logs';

// MongoDB client
let db;
let logsCollection;

// Sample data to insert if collection is empty
const sampleLogs = [
  {
    "country_code": "US",
    "currency_code": "USD",
    "progress": {
      "SWITCH_INDEX": true,
      "TOTAL_RECORDS_IN_FEED": 16493,
      "TOTAL_JOBS_FAIL_INDEXED": 1521,
      "TOTAL_JOBS_IN_FEED": 13705,
      "TOTAL_JOBS_SENT_TO_ENRICH": 20,
      "TOTAL_JOBS_DONT_HAVE_METADATA": 2540,
      "TOTAL_JOBS_DONT_HAVE_METADATA_V2": 2568,
      "TOTAL_JOBS_SENT_TO_INDEX": 13686
    },
    "status": "completed",
    "timestamp": new Date("2025-07-11T05:16:20.626Z"),
    "transactionSourceName": "Deal4",
    "noCoordinatesCount": 160,
    "recordCount": 11118,
    "uniqueRefNumberCount": 9253
  },
  // Add more sample logs here if needed
];

// Connect to MongoDB
async function connectToMongo() {
  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    console.log('Connected to MongoDB');
    
    db = client.db();
    logsCollection = db.collection(collectionName);
    
    // Insert sample data if collection is empty
    const count = await logsCollection.countDocuments();
    if (count === 0) {
      await insertSampleData();
    }
    
    return logsCollection;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

// Insert sample data if collection is empty
async function insertSampleData() {
  try {
    await logsCollection.insertMany(sampleLogs);
    console.log('Sample data inserted');
  } catch (err) {
    console.error('Error inserting sample data:', err);
  }
}

module.exports = { connectToMongo };