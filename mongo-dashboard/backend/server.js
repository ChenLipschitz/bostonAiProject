const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 12000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/local';
const collectionName = process.env.COLLECTION_NAME || 'logs';

// MongoDB client
let db;
let logsCollection;

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
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

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
  }
];

// Insert sample data if collection is empty
async function insertSampleData() {
  try {
    await logsCollection.insertMany(sampleLogs);
    console.log('Sample data inserted');
  } catch (err) {
    console.error('Error inserting sample data:', err);
  }
}

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.get('/api/logs', async (req, res) => {
  try {
    const logs = await logsCollection.find({}).limit(100).toArray();
    res.json(logs);
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// Statistics endpoints
app.get('/api/stats/country', async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: '$country_code',
          totalRecords: { $sum: '$recordCount' }
        }
      }
    ];
    
    const results = await logsCollection.aggregate(pipeline).toArray();
    
    const countryStats = {};
    results.forEach(result => {
      countryStats[result._id] = result.totalRecords;
    });
    
    res.json(countryStats);
  } catch (err) {
    console.error('Error fetching country stats:', err);
    res.status(500).json({ error: 'Failed to fetch country statistics' });
  }
});

app.get('/api/stats/status', async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ];
    
    const results = await logsCollection.aggregate(pipeline).toArray();
    
    const statusStats = {};
    results.forEach(result => {
      statusStats[result._id] = result.count;
    });
    
    res.json(statusStats);
  } catch (err) {
    console.error('Error fetching status stats:', err);
    res.status(500).json({ error: 'Failed to fetch status statistics' });
  }
});

app.get('/api/stats/progress', async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: null,
          totalRecordsInFeed: { $sum: '$progress.TOTAL_RECORDS_IN_FEED' },
          totalJobsFailIndexed: { $sum: '$progress.TOTAL_JOBS_FAIL_INDEXED' },
          totalJobsInFeed: { $sum: '$progress.TOTAL_JOBS_IN_FEED' },
          totalJobsSentToEnrich: { $sum: '$progress.TOTAL_JOBS_SENT_TO_ENRICH' },
          totalJobsDontHaveMetadata: { $sum: '$progress.TOTAL_JOBS_DONT_HAVE_METADATA' },
          totalJobsDontHaveMetadataV2: { $sum: '$progress.TOTAL_JOBS_DONT_HAVE_METADATA_V2' },
          totalJobsSentToIndex: { $sum: '$progress.TOTAL_JOBS_SENT_TO_INDEX' }
        }
      }
    ];
    
    const results = await logsCollection.aggregate(pipeline).toArray();
    
    if (results.length > 0) {
      const { _id, ...progressStats } = results[0];
      res.json(progressStats);
    } else {
      res.json({
        totalRecordsInFeed: 0,
        totalJobsFailIndexed: 0,
        totalJobsInFeed: 0,
        totalJobsSentToEnrich: 0,
        totalJobsDontHaveMetadata: 0,
        totalJobsDontHaveMetadataV2: 0,
        totalJobsSentToIndex: 0
      });
    }
  } catch (err) {
    console.error('Error fetching progress stats:', err);
    res.status(500).json({ error: 'Failed to fetch progress statistics' });
  }
});

// Connect to MongoDB and start server
connectToMongo().then(() => {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
});