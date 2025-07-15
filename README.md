# boston.AI Dashboard

A full-stack web application that visualizes statistics from job applications.

## Features

- Dashboard with multiple charts showing data statistics 
   - 
   - Country distribution chart
   - Status distribution chart
   - Progress metrics chart
   - Logs table with recent entries
   - Date range picker for filtering logs by timestamp
   - Trend Analysis
- AI Assistnace that plot charts based on a natural language query


## Tech Stack

### Backend
- Node.js
- Express.js

### Frontend
- React
- TypeScript
- Material-UI for components
- Chart.js for data visualization

## Project Structure

```
boston-dashboard/
├── backend/                  # Node.js Express backend
│   ├── server-with-mongodb.js # MongoDB-enabled server
│   ├── src                    # src code files 
│   ├── dist                  # java script compiled files (necessary!)
│   ├── mongodb-connection.js # MongoDB connection module
│   ├── .env                  # Environment variables
│   └── package.json          # Backend dependencies
│   └── package-lock.json          # Backend dependencies

├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API services
│   │   ├── types/            # TypeScript interfaces
│   │   └── App.tsx           # Main application component
│   ├── package.json          # Frontend dependencies
│   └── tsconfig.json         # TypeScript configuration
├── start-servers.js          # Script to start all servers (backend and frontend, assums mongoDB running on localhost:27017)
└── MONGODB_SETUP.md          # MongoDB setup instructions
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (for MongoDB integration) running on localhost:27017, can be configured on .env file (``MONGODB_URI``)

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

#### Assuming MongoDB is Running on localhost:27017 with collection named logs.

Run both servers with the provided script:

```
./start-servers.sh
```

This will start:
- Backend server on port 12000 (with sample data)
- Frontend server on port 12001

Access the application at:
- Backend API: http://localhost:12000
- Frontend UI: http://localhost:12001


### Installing MongoDB (using docker)

1. docker pull library/mongo
2. docker run -p 27017:27017 -t mongo library/mongo
3. create a collection named "logs"
4. load the boston.ai data to the collection  

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
<!--
## Dashboard Examples

![Dashboard 1](images/dashboard.jpg)
![Dashboard 1](images/dashboard_trend_analysis.jpg)
![Dashboard 1](images/dashboard_data_distribution.jpg)


### FIltering by a Country (US)

![Dashboard 2](images/dashboard_US.jpg)
![Dashboard 2](images/dashboard_trend_analysis_US.jpg)
![Dashboard 2](images/dashboard_data_distribution_US.jpg)



![Dashboard 3](images/dashboard3.png) -->

## Dashboard Examples

### General Overview

![Dashboard 1](images/dashboard.jpg)
![Dashboard 1](images/dashboard_trend_analysis.jpg)
![Dashboard 1](images/dashboard_data_distribution.jpg)

### Filtering by Country (US)

![Dashboard 2](images/dashboard_US.jpg)
![Dashboard 2](images/dashboard_trend_analysis_US.jpg) ![Dashboard 2](images/dashboard_data_distribution_US.jpg)

## AI Chat Assistant Examples

### General Overview
![Dashboard 3](images/AI_assistant_landing.jpg)


### Queries
![Dashboard 3](images/chat_avg.jpg) 
![Dashboard 3](images/chat_record_count_by_country_code.jpg)
![Dashboard 3](images/chat_top_client.jpg)