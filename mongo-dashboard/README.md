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
├── backend/             # Node.js Express backend
│   ├── server.js        # Main server file
│   ├── .env             # Environment variables
│   └── package.json     # Backend dependencies
├── frontend/            # React TypeScript frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API services
│   │   ├── types/       # TypeScript interfaces
│   │   └── App.tsx      # Main application component
│   ├── package.json     # Frontend dependencies
│   └── tsconfig.json    # TypeScript configuration
└── run-app.sh           # Script to run both servers
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)

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

Run both servers with the provided script:

```
./run-app.sh
```

This will start:
- Backend server on port 12000
- Frontend server on port 12001

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

1. Ensure MongoDB is running on port 27017
2. Update the server.js file to use the MongoDB connection code
3. Set the correct database and collection names in the .env file

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