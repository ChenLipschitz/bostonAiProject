#!/bin/bash

# Kill any existing processes on ports 12000 and 12001
kill $(lsof -t -i:12000) 2>/dev/null
kill $(lsof -t -i:12001) 2>/dev/null

# Start the backend server
cd /workspace/mongo-dashboard/backend
echo "Starting backend server on port 12000..."
node server.js > backend.log 2>&1 &
echo "Backend server started with PID $!"

# Wait a bit for the backend to start
sleep 2

# Start the frontend server
cd /workspace/mongo-dashboard/frontend
echo "Starting frontend server on port 12001..."
PORT=12001 npm start > frontend.log 2>&1 &
echo "Frontend server started with PID $!"

echo ""
echo "Both servers are now running in the background."
echo "Backend server: http://localhost:12000"
echo "Frontend server: http://localhost:12001"
echo ""
echo "You can access the frontend at:"
echo "https://work-2-xubperdvaujilttz.prod-runtime.all-hands.dev"
echo ""
echo "To view logs:"
echo "Backend logs: tail -f /workspace/mongo-dashboard/backend/backend.log"
echo "Frontend logs: tail -f /workspace/mongo-dashboard/frontend/frontend.log"
echo ""
echo "To stop the servers:"
echo "kill \$(lsof -t -i:12000) \$(lsof -t -i:12001)"