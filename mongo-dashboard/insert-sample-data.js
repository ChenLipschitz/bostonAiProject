/**
 * MongoDB Sample Data Insertion Script
 * 
 * This script inserts sample data into the MongoDB logs collection.
 */

const { MongoClient } = require('mongodb');

// MongoDB Connection URI
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/local';
const collectionName = process.env.COLLECTION_NAME || 'logs';

// Sample data to insert
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
  {
    "country_code": "UK",
    "currency_code": "GBP",
    "progress": {
      "SWITCH_INDEX": true,
      "TOTAL_RECORDS_IN_FEED": 12000,
      "TOTAL_JOBS_FAIL_INDEXED": 800,
      "TOTAL_JOBS_IN_FEED": 10000,
      "TOTAL_JOBS_SENT_TO_ENRICH": 15,
      "TOTAL_JOBS_DONT_HAVE_METADATA": 1200,
      "TOTAL_JOBS_DONT_HAVE_METADATA_V2": 1300,
      "TOTAL_JOBS_SENT_TO_INDEX": 9800
    },
    "status": "completed",
    "timestamp": new Date("2025-07-12T08:30:15.123Z"),
    "transactionSourceName": "Deal5",
    "noCoordinatesCount": 120,
    "recordCount": 8500,
    "uniqueRefNumberCount": 7200
  },
  {
    "country_code": "CA",
    "currency_code": "CAD",
    "progress": {
      "SWITCH_INDEX": true,
      "TOTAL_RECORDS_IN_FEED": 9000,
      "TOTAL_JOBS_FAIL_INDEXED": 600,
      "TOTAL_JOBS_IN_FEED": 7500,
      "TOTAL_JOBS_SENT_TO_ENRICH": 10,
      "TOTAL_JOBS_DONT_HAVE_METADATA": 900,
      "TOTAL_JOBS_DONT_HAVE_METADATA_V2": 950,
      "TOTAL_JOBS_SENT_TO_INDEX": 7400
    },
    "status": "completed",
    "timestamp": new Date("2025-07-13T12:45:30.456Z"),
    "transactionSourceName": "Deal6",
    "noCoordinatesCount": 90,
    "recordCount": 6300,
    "uniqueRefNumberCount": 5400
  },
  {
    "country_code": "AU",
    "currency_code": "AUD",
    "progress": {
      "SWITCH_INDEX": false,
      "TOTAL_RECORDS_IN_FEED": 7000,
      "TOTAL_JOBS_FAIL_INDEXED": 400,
      "TOTAL_JOBS_IN_FEED": 6000,
      "TOTAL_JOBS_SENT_TO_ENRICH": 8,
      "TOTAL_JOBS_DONT_HAVE_METADATA": 700,
      "TOTAL_JOBS_DONT_HAVE_METADATA_V2": 750,
      "TOTAL_JOBS_SENT_TO_INDEX": 5900
    },
    "status": "in_progress",
    "timestamp": new Date("2025-07-14T03:20:45.789Z"),
    "transactionSourceName": "Deal7",
    "noCoordinatesCount": 70,
    "recordCount": 5100,
    "uniqueRefNumberCount": 4300
  },
  {
    "country_code": "DE",
    "currency_code": "EUR",
    "progress": {
      "SWITCH_INDEX": true,
      "TOTAL_RECORDS_IN_FEED": 14000,
      "TOTAL_JOBS_FAIL_INDEXED": 900,
      "TOTAL_JOBS_IN_FEED": 12000,
      "TOTAL_JOBS_SENT_TO_ENRICH": 18,
      "TOTAL_JOBS_DONT_HAVE_METADATA": 1800,
      "TOTAL_JOBS_DONT_HAVE_METADATA_V2": 1900,
      "TOTAL_JOBS_SENT_TO_INDEX": 11900
    },
    "status": "completed",
    "timestamp": new Date("2025-07-10T14:25:10.333Z"),
    "transactionSourceName": "Deal3",
    "noCoordinatesCount": 140,
    "recordCount": 9800,
    "uniqueRefNumberCount": 8200
  },
  {
    "country_code": "FR",
    "currency_code": "EUR",
    "progress": {
      "SWITCH_INDEX": true,
      "TOTAL_RECORDS_IN_FEED": 11000,
      "TOTAL_JOBS_FAIL_INDEXED": 700,
      "TOTAL_JOBS_IN_FEED": 9500,
      "TOTAL_JOBS_SENT_TO_ENRICH": 12,
      "TOTAL_JOBS_DONT_HAVE_METADATA": 1400,
      "TOTAL_JOBS_DONT_HAVE_METADATA_V2": 1500,
      "TOTAL_JOBS_SENT_TO_INDEX": 9400
    },
    "status": "completed",
    "timestamp": new Date("2025-07-09T10:15:05.222Z"),
    "transactionSourceName": "Deal2",
    "noCoordinatesCount": 110,
    "recordCount": 7700,
    "uniqueRefNumberCount": 6500
  },
  {
    "country_code": "JP",
    "currency_code": "JPY",
    "progress": {
      "SWITCH_INDEX": false,
      "TOTAL_RECORDS_IN_FEED": 8000,
      "TOTAL_JOBS_FAIL_INDEXED": 500,
      "TOTAL_JOBS_IN_FEED": 7000,
      "TOTAL_JOBS_SENT_TO_ENRICH": 9,
      "TOTAL_JOBS_DONT_HAVE_METADATA": 1000,
      "TOTAL_JOBS_DONT_HAVE_METADATA_V2": 1100,
      "TOTAL_JOBS_SENT_TO_INDEX": 6900
    },
    "status": "in_progress",
    "timestamp": new Date("2025-07-14T09:30:25.444Z"),
    "transactionSourceName": "Deal8",
    "noCoordinatesCount": 80,
    "recordCount": 5900,
    "uniqueRefNumberCount": 5000
  }
];

async function insertSampleData() {
  let client;
  
  try {
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    client = new MongoClient(mongoUri);
    await client.connect();
    
    console.log('✅ Successfully connected to MongoDB');
    
    // Get database name from URI or use default
    const dbName = mongoUri.split('/').pop().split('?')[0] || 'local';
    const db = client.db(dbName);
    
    // Check if collection exists, create if it doesn't
    const collections = await db.listCollections({name: collectionName}).toArray();
    if (collections.length === 0) {
      console.log(`Creating collection '${collectionName}'...`);
      await db.createCollection(collectionName);
    }
    
    // Get the collection
    const collection = db.collection(collectionName);
    
    // Check if collection already has data
    const count = await collection.countDocuments();
    if (count > 0) {
      console.log(`Collection '${collectionName}' already has ${count} documents.`);
      const shouldContinue = await promptUser('Do you want to add more sample data? (y/n): ');
      
      if (shouldContinue.toLowerCase() !== 'y') {
        console.log('Operation cancelled by user.');
        return;
      }
    }
    
    // Insert sample data
    console.log(`Inserting ${sampleLogs.length} sample documents...`);
    const result = await collection.insertMany(sampleLogs);
    
    console.log(`✅ Successfully inserted ${result.insertedCount} documents`);
    
    // Count documents after insertion
    const newCount = await collection.countDocuments();
    console.log(`Collection '${collectionName}' now has ${newCount} documents.`);
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Simple function to prompt user for input
function promptUser(question) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise(resolve => {
    readline.question(question, answer => {
      readline.close();
      resolve(answer);
    });
  });
}

// Run the insertion script
insertSampleData().catch(console.error);