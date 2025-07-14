# MongoDB Dashboard Project Summary

## Overview

This project is a full-stack web application that visualizes statistics from MongoDB logs. It consists of a Node.js/Express backend and a React/TypeScript frontend with charts and tables to display the data.

## Features

- **Dashboard with Multiple Charts**: Visualize data in different formats
- **Country Distribution Chart**: Shows record counts by country
- **Status Distribution Chart**: Shows completed vs. in-progress logs
- **Progress Metrics Chart**: Displays various progress statistics
- **Logs Table**: Shows detailed information about each log entry

## Technical Implementation

### Backend (Node.js/Express)

- **Server**: Express.js server running on port 12000
- **API Endpoints**: RESTful endpoints for fetching logs and statistics
- **Data Source**: Currently using sample data, with MongoDB integration ready for implementation
- **CORS**: Configured to allow cross-origin requests from any source

### Frontend (React/TypeScript)

- **Framework**: React with TypeScript
- **UI Components**: Custom components for charts and tables
- **State Management**: React hooks for state management
- **API Integration**: Axios for API requests
- **Visualization**: Chart.js for data visualization
- **Styling**: CSS with responsive design

## Project Structure

```
mongo-dashboard/
├── backend/             # Node.js Express backend
│   ├── server.js        # Main server file
│   ├── .env             # Environment variables
│   ├── mongodb-connection.js # MongoDB connection module (for future use)
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

## Data Model

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

## Future Enhancements

1. **MongoDB Integration**: Connect to a real MongoDB instance
2. **Authentication**: Add user authentication and authorization
3. **Filtering**: Add filters for date ranges, countries, etc.
4. **Real-time Updates**: Implement WebSockets for real-time data updates
5. **Export Functionality**: Allow exporting data to CSV or Excel
6. **Additional Visualizations**: Add more chart types and visualizations
7. **Pagination**: Add pagination for the logs table
8. **Search**: Add search functionality for logs

## Running the Application

1. Start both servers with the provided script:
   ```bash
   ./run-app.sh
   ```

2. Access the application:
   - Backend API: http://localhost:12000
   - Frontend UI: http://localhost:12001

## API Endpoints

- `GET /api/logs` - Get all logs
- `GET /api/stats/country` - Get country statistics
- `GET /api/stats/status` - Get status statistics
- `GET /api/stats/progress` - Get progress statistics