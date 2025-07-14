/**
 * MongoDB Connection Test Script
 * 
 * This script tests the connection to MongoDB and checks if the logs collection exists.
 * It also displays the first document in the collection if it exists.
 */

const { MongoClient } = require('mongodb');

// MongoDB Connection URI
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/local';
const collectionName = process.env.COLLECTION_NAME || 'logs';

async function testMongoConnection() {
  let client;
  
  try {
    console.log(`Attempting to connect to MongoDB at: ${mongoUri}`);
    client = new MongoClient(mongoUri);
    await client.connect();
    
    console.log('✅ Successfully connected to MongoDB');
    
    // Get database name from URI or use default
    const dbName = mongoUri.split('/').pop().split('?')[0] || 'local';
    const db = client.db(dbName);
    
    // List collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    console.log(`\nAvailable collections in database '${dbName}':`);
    console.log(collectionNames);
    
    // Check if logs collection exists
    if (collectionNames.includes(collectionName)) {
      console.log(`\n✅ Collection '${collectionName}' exists`);
      
      // Count documents
      const count = await db.collection(collectionName).countDocuments();
      console.log(`Number of documents in '${collectionName}': ${count}`);
      
      if (count > 0) {
        // Get first document
        const firstDoc = await db.collection(collectionName).findOne({});
        console.log('\nSample document:');
        console.log(JSON.stringify(firstDoc, null, 2));
      } else {
        console.log('\n⚠️ Collection is empty. You may need to insert sample data.');
      }
    } else {
      console.log(`\n⚠️ Collection '${collectionName}' does not exist`);
      console.log('You need to create the collection and insert data.');
    }
    
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
  } finally {
    if (client) {
      await client.close();
      console.log('\nMongoDB connection closed');
    }
  }
}

// Run the test
testMongoConnection().catch(console.error);