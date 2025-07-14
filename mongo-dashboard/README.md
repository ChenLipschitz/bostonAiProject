# MongoDB Logs Dashboard

A full-stack web application that visualizes statistics from a MongoDB logs collection.

## Features

- Dashboard with multiple charts showing data statistics
- Country distribution chart
- Status distribution chart
- Progress metrics chart
- Logs table with recent entries

## Tech Stack

### Backend
- Node.js
- Express.js
- Sample data (simulating MongoDB data)

### Frontend
- React
- TypeScript
- Material-UI for components
- Chart.js for data visualization

## Project Structure

```
mongo-dashboard/
├── backend/                  # Node.js Express backend
│   ├── server.js             # Main server file
│   ├── server-with-mongodb.js # MongoDB-enabled server
│   ├── mongodb-connection.js # MongoDB connection module
│   ├── .env                  # Environment variables
│   └── package.json          # Backend dependencies
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API services
│   │   ├── types/            # TypeScript interfaces
│   │   └── App.tsx           # Main application component
│   ├── package.json          # Frontend dependencies
│   └── tsconfig.json         # TypeScript configuration
├── run-app.sh                # Script to run both servers
├── run-with-mongodb.sh       # Script to run with MongoDB
├── check-mongo-connection.js # Script to test MongoDB connection
├── insert-sample-data.js     # Script to insert sample data
└── MONGODB_SETUP.md          # MongoDB setup instructions
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (for MongoDB integration)

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

### Running the Application

#### Without MongoDB (using sample data)

Run both servers with the provided script:

```
./run-app.sh
```

This will start:
- Backend server on port 12000 (with sample data)
- Frontend server on port 12001

#### With MongoDB

Run the application with MongoDB support:

```
./run-with-mongodb.sh
```

This will:
1. Check if MongoDB is running
2. Install the MongoDB driver if needed
3. Use the MongoDB-enabled server file
4. Start both servers

Access the application at:
- Backend API: http://localhost:12000
- Frontend UI: http://localhost:12001

## API Endpoints

- `GET /api/logs` - Get all logs
- `GET /api/stats/country` - Get country statistics
- `GET /api/stats/status` - Get status statistics
- `GET /api/stats/progress` - Get progress statistics

## MongoDB Integration

The application is designed to work with MongoDB, but currently uses sample data. To connect to a real MongoDB instance:

### Option 1: Using the MongoDB-enabled script

1. Ensure MongoDB is running on port 27017
2. Run the application with MongoDB support:
   ```bash
   ./run-with-mongodb.sh
   ```

### Option 2: Manual Setup

1. Ensure MongoDB is running on port 27017
2. Check if MongoDB is properly connected:
   ```bash
   node check-mongo-connection.js
   ```
3. Insert sample data into MongoDB:
   ```bash
   node insert-sample-data.js
   ```
4. Replace the server.js file with the MongoDB-enabled version:
   ```bash
   cp backend/server-with-mongodb.js backend/server.js
   ```
5. Set the correct database and collection names in the .env file:
   ```
   MONGODB_URI=mongodb://localhost:27017/local
   COLLECTION_NAME=logs
   ```

For detailed MongoDB setup instructions, see [MONGODB_SETUP.md](MONGODB_SETUP.md)

## Data Format

The application works with logs in the following format:

```json
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
}
```