#!/bin/bash

# Start the backend server
cd /workspace/mongo-dashboard/backend
echo "Starting backend server on port 12000..."
npm start &
BACKEND_PID=$!

# Wait a bit for the backend to start
sleep 3

# Start the frontend server
cd /workspace/mongo-dashboard/frontend
echo "Starting frontend server on port 12001..."
npm start &
FRONTEND_PID=$!

# Function to handle script termination
function cleanup {
  echo "Stopping servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit
}

# Trap SIGINT and SIGTERM signals
trap cleanup SIGINT SIGTERM

# Keep the script running
echo "Both servers are running. Press Ctrl+C to stop."
wait