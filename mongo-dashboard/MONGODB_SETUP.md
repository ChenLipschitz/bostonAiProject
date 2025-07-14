# MongoDB Setup Instructions

This document explains how to set up and connect the application to your local MongoDB instance.

## Prerequisites

1. MongoDB installed and running on your local machine (port 27017)
2. Node.js and npm installed

## Setup Steps

### 1. Create the MongoDB Database and Collection

You can use the MongoDB shell or MongoDB Compass to create a database and collection:

```bash
# Connect to MongoDB shell
mongo

# Create/use the 'local' database
use local

# Create the 'logs' collection
db.createCollection('logs')
```

### 2. Insert Sample Data

You can insert the sample data into your MongoDB collection:

```javascript
db.logs.insertMany([
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
  }
])
```

### 3. Configure the Backend

1. Make sure MongoDB is running on port 27017
2. Use the MongoDB-enabled server file:

```bash
# Navigate to the backend directory
cd mongo-dashboard/backend

# Install MongoDB driver if not already installed
npm install mongodb

# Use the MongoDB-enabled server file
cp server-with-mongodb.js server.js
# OR
node server-with-mongodb.js
```

### 4. Environment Variables (Optional)

You can create a `.env` file in the backend directory to customize the MongoDB connection:

```
# .env file
MONGODB_URI=mongodb://localhost:27017/local
COLLECTION_NAME=logs
PORT=12000
```

### 5. Run the Application

Start both the backend and frontend servers:

```bash
# From the project root
./run-app.sh
```

## Troubleshooting

### MongoDB Connection Issues

If you encounter connection issues:

1. Verify MongoDB is running:
   ```bash
   # Check if MongoDB is running
   ps aux | grep mongod
   ```

2. Check MongoDB logs:
   ```bash
   # Location may vary depending on your installation
   cat /var/log/mongodb/mongod.log
   ```

3. Test connection with a simple script:
   ```bash
   # Create a test script
   echo 'const { MongoClient } = require("mongodb");
   async function testConnection() {
     try {
       const client = new MongoClient("mongodb://localhost:27017");
       await client.connect();
       console.log("Connected successfully to MongoDB");
       await client.close();
     } catch (err) {
       console.error("Failed to connect to MongoDB:", err);
     }
   }
   testConnection();' > test-mongo.js
   
   # Run the test script
   node test-mongo.js
   ```

### Data Format Issues

If you encounter issues with data format:

1. Make sure the data structure matches the expected format
2. Check that date fields are properly formatted as Date objects
3. Verify that numeric fields are stored as numbers, not strings

## Advanced Configuration

### Using MongoDB Atlas

If you want to use MongoDB Atlas instead of a local MongoDB instance:

1. Create a MongoDB Atlas account and cluster
2. Get your connection string from MongoDB Atlas
3. Update the `.env` file with your connection string:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
   COLLECTION_NAME=logs
   ```

### Securing MongoDB

For production use, consider:

1. Enabling authentication
2. Using SSL/TLS for connections
3. Implementing proper access controls
4. Setting up backups