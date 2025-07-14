#!/bin/bash

# This script runs the application with MongoDB connection

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "MongoDB is not installed. Please install MongoDB first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x mongod > /dev/null; then
    echo "MongoDB is not running. Starting MongoDB..."
    # This command may vary depending on your OS and MongoDB installation
    mongod --dbpath /var/lib/mongodb &
    sleep 5
fi

# Install MongoDB driver if not already installed
echo "Checking for MongoDB driver..."
cd backend
if ! grep -q "mongodb" package.json; then
    echo "Installing MongoDB driver..."
    npm install mongodb --save
fi

# Use the MongoDB-enabled server file
echo "Setting up MongoDB-enabled server..."
cp server-with-mongodb.js server.js

# Start the backend server
echo "Starting backend server..."
node server.js > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend server started with PID: $BACKEND_PID"

# Start the frontend server
echo "Starting frontend server..."
cd ../frontend
npm start > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend server started with PID: $FRONTEND_PID"

echo "Both servers are running!"
echo "Backend: http://localhost:12000"
echo "Frontend: http://localhost:12001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to kill processes on exit
function cleanup {
    echo "Stopping servers..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    echo "Servers stopped"
}

# Register the cleanup function for when script exits
trap cleanup EXIT

# Wait for user to press Ctrl+C
wait