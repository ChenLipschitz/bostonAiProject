const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 12000;

// Sample data (simulating MongoDB data)
const sampleLogs = [
  {
    "_id": "68709db2402cf56cd3813d9e",
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
    "timestamp": "2025-07-11T05:16:20.626Z",
    "transactionSourceName": "Deal4",
    "noCoordinatesCount": 160,
    "recordCount": 11118,
    "uniqueRefNumberCount": 9253
  },
  {
    "_id": "68709db2402cf56cd3813d9f",
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
    "timestamp": "2025-07-12T08:30:15.123Z",
    "transactionSourceName": "Deal5",
    "noCoordinatesCount": 120,
    "recordCount": 8500,
    "uniqueRefNumberCount": 7200
  },
  {
    "_id": "68709db2402cf56cd3813da0",
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
    "timestamp": "2025-07-13T12:45:30.456Z",
    "transactionSourceName": "Deal6",
    "noCoordinatesCount": 90,
    "recordCount": 6300,
    "uniqueRefNumberCount": 5400
  },
  {
    "_id": "68709db2402cf56cd3813da1",
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
    "timestamp": "2025-07-14T03:20:45.789Z",
    "transactionSourceName": "Deal7",
    "noCoordinatesCount": 70,
    "recordCount": 5100,
    "uniqueRefNumberCount": 4300
  },
  {
    "_id": "68709db2402cf56cd3813da2",
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
    "timestamp": "2025-07-10T14:25:10.333Z",
    "transactionSourceName": "Deal3",
    "noCoordinatesCount": 140,
    "recordCount": 9800,
    "uniqueRefNumberCount": 8200
  },
  {
    "_id": "68709db2402cf56cd3813da3",
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
    "timestamp": "2025-07-09T10:15:05.222Z",
    "transactionSourceName": "Deal2",
    "noCoordinatesCount": 110,
    "recordCount": 7700,
    "uniqueRefNumberCount": 6500
  },
  {
    "_id": "68709db2402cf56cd3813da4",
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
    "timestamp": "2025-07-14T09:30:25.444Z",
    "transactionSourceName": "Deal8",
    "noCoordinatesCount": 80,
    "recordCount": 5900,
    "uniqueRefNumberCount": 5000
  }
];

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.get('/api/logs', (req, res) => {
  console.log('Fetching logs');
  res.json(sampleLogs);
});

// Statistics endpoints
app.get('/api/stats/country', (req, res) => {
  console.log('Fetching country stats');
  const countryStats = {};
  sampleLogs.forEach(log => {
    if (!countryStats[log.country_code]) {
      countryStats[log.country_code] = 0;
    }
    countryStats[log.country_code] += log.recordCount;
  });
  res.json(countryStats);
});

app.get('/api/stats/status', (req, res) => {
  console.log('Fetching status stats');
  const statusStats = {};
  sampleLogs.forEach(log => {
    if (!statusStats[log.status]) {
      statusStats[log.status] = 0;
    }
    statusStats[log.status]++;
  });
  res.json(statusStats);
});

app.get('/api/stats/progress', (req, res) => {
  console.log('Fetching progress stats');
  const progressStats = {
    totalRecordsInFeed: 0,
    totalJobsFailIndexed: 0,
    totalJobsInFeed: 0,
    totalJobsSentToEnrich: 0,
    totalJobsDontHaveMetadata: 0,
    totalJobsDontHaveMetadataV2: 0,
    totalJobsSentToIndex: 0
  };
  
  sampleLogs.forEach(log => {
    progressStats.totalRecordsInFeed += log.progress.TOTAL_RECORDS_IN_FEED || 0;
    progressStats.totalJobsFailIndexed += log.progress.TOTAL_JOBS_FAIL_INDEXED || 0;
    progressStats.totalJobsInFeed += log.progress.TOTAL_JOBS_IN_FEED || 0;
    progressStats.totalJobsSentToEnrich += log.progress.TOTAL_JOBS_SENT_TO_ENRICH || 0;
    progressStats.totalJobsDontHaveMetadata += log.progress.TOTAL_JOBS_DONT_HAVE_METADATA || 0;
    progressStats.totalJobsDontHaveMetadataV2 += log.progress.TOTAL_JOBS_DONT_HAVE_METADATA_V2 || 0;
    progressStats.totalJobsSentToIndex += log.progress.TOTAL_JOBS_SENT_TO_INDEX || 0;
  });
  
  res.json(progressStats);
});

// Add a message about MongoDB connection
app.get('/', (req, res) => {
  res.send(`
    <h1>MongoDB Logs Dashboard API</h1>
    <p>This API is currently using sample data instead of connecting to MongoDB.</p>
    <p>When MongoDB is available on port 27017, update the server code to connect to the actual database.</p>
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
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`Note: Using sample data instead of MongoDB connection`);
});