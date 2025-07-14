const { MongoClient } = require('mongodb');

async function main() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const databases = await client.db().admin().listDatabases();
    console.log('Databases:');
    databases.databases.forEach(db => console.log(` - ${db.name}`));
    
    // Try to access the logs collection
    const db = client.db(); // Use default database
    const collections = await db.listCollections().toArray();
    console.log('Collections:');
    collections.forEach(collection => console.log(` - ${collection.name}`));
    
  } catch (e) {
    console.error('Error connecting to MongoDB:', e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);