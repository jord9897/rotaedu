#!/bin/bash
# Start backend API
node server/index.js &
BACKEND_PID=$!

# Start frontend (exposed preview port)
npx vite --host 0.0.0.0 --port 5173

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
