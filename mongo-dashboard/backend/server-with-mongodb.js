const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 12000;

// MongoDB Connection URI
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/local';
const collectionName = process.env.COLLECTION_NAME || 'logs';

// MongoDB client
let db;
let logsCollection;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Connect to MongoDB
async function connectToMongo() {
  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    console.log('Connected to MongoDB');
    
    db = client.db();
    logsCollection = db.collection(collectionName);
    
    return logsCollection;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

// Routes
app.get('/api/logs', async (req, res) => {
  try {
    console.log('Fetching logs from MongoDB');
    const logs = await logsCollection.find({}).toArray();
    res.json(logs);
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// Statistics endpoints
app.get('/api/stats/country', async (req, res) => {
  try {
    console.log('Fetching country stats from MongoDB');
    const logs = await logsCollection.find({}).toArray();
    const countryStats = {};
    logs.forEach(log => {
      if (!countryStats[log.country_code]) {
        countryStats[log.country_code] = 0;
      }
      countryStats[log.country_code] += log.recordCount;
    });
    res.json(countryStats);
  } catch (err) {
    console.error('Error fetching country stats:', err);
    res.status(500).json({ error: 'Failed to fetch country stats' });
  }
});

app.get('/api/stats/status', async (req, res) => {
  try {
    console.log('Fetching status stats from MongoDB');
    const logs = await logsCollection.find({}).toArray();
    const statusStats = {};
    logs.forEach(log => {
      if (!statusStats[log.status]) {
        statusStats[log.status] = 0;
      }
      statusStats[log.status]++;
    });
    res.json(statusStats);
  } catch (err) {
    console.error('Error fetching status stats:', err);
    res.status(500).json({ error: 'Failed to fetch status stats' });
  }
});

app.get('/api/stats/progress', async (req, res) => {
  try {
    console.log('Fetching progress stats from MongoDB');
    const logs = await logsCollection.find({}).toArray();
    const progressStats = {
      totalRecordsInFeed: 0,
      totalJobsFailIndexed: 0,
      totalJobsInFeed: 0,
      totalJobsSentToEnrich: 0,
      totalJobsDontHaveMetadata: 0,
      totalJobsDontHaveMetadataV2: 0,
      totalJobsSentToIndex: 0
    };
    
    logs.forEach(log => {
      progressStats.totalRecordsInFeed += log.progress.TOTAL_RECORDS_IN_FEED || 0;
      progressStats.totalJobsFailIndexed += log.progress.TOTAL_JOBS_FAIL_INDEXED || 0;
      progressStats.totalJobsInFeed += log.progress.TOTAL_JOBS_IN_FEED || 0;
      progressStats.totalJobsSentToEnrich += log.progress.TOTAL_JOBS_SENT_TO_ENRICH || 0;
      progressStats.totalJobsDontHaveMetadata += log.progress.TOTAL_JOBS_DONT_HAVE_METADATA || 0;
      progressStats.totalJobsDontHaveMetadataV2 += log.progress.TOTAL_JOBS_DONT_HAVE_METADATA_V2 || 0;
      progressStats.totalJobsSentToIndex += log.progress.TOTAL_JOBS_SENT_TO_INDEX || 0;
    });
    
    res.json(progressStats);
  } catch (err) {
    console.error('Error fetching progress stats:', err);
    res.status(500).json({ error: 'Failed to fetch progress stats' });
  }
});

// Add a message about MongoDB connection
app.get('/', (req, res) => {
  res.send(`
    <h1>MongoDB Logs Dashboard API</h1>
    <p>This API is connected to MongoDB on ${mongoUri}</p>
    <p>Collection: ${collectionName}</p>
    <h2>Available Endpoints:</h2>
    <ul>
      <li><a href="/api/logs">/api/logs</a> - Get all logs</li>
      <li><a href="/api/stats/country">/api/stats/country</a> - Get country statistics</li>
      <li><a href="/api/stats/status">/api/stats/status</a> - Get status statistics</li>
      <li><a href="/api/stats/progress">/api/stats/progress</a> - Get progress statistics</li>
    </ul>
  `);
});

// Start server
async function startServer() {
  try {
    await connectToMongo();
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port}`);
      console.log(`Connected to MongoDB at ${mongoUri}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

startServer();