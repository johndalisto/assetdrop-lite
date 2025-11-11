#!/bin/bash

echo "🚀 Starting ngrok tunnels for AssetDrop..."

# Start backend tunnel
echo "Starting backend tunnel (port 3001)..."
ngrok http 3001 --log=stdout > ngrok-backend.log 2>&1 &
BACKEND_PID=$!

# Start frontend tunnel  
echo "Starting frontend tunnel (port 3000)..."
ngrok http 3000 --log=stdout > ngrok-frontend.log 2>&1 &
FRONTEND_PID=$!

echo "Waiting for tunnels to establish..."
sleep 5

echo ""
echo "🔍 Getting tunnel URLs..."

# Get backend URL
BACKEND_URL=$(curl -s http://localhost:4040/api/tunnels | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    for tunnel in data['tunnels']:
        if tunnel['config']['addr'] == 'http://localhost:3001':
            print(tunnel['public_url'])
            break
except:
    print('Error getting backend URL')
")

# Get frontend URL
FRONTEND_URL=$(curl -s http://localhost:4040/api/tunnels | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    for tunnel in data['tunnels']:
        if tunnel['config']['addr'] == 'http://localhost:3000':
            print(tunnel['public_url'])
            break
except:
    print('Error getting frontend URL')
")

echo ""
echo "✅ Tunnels are ready!"
echo ""
echo "🌐 Frontend URL: $FRONTEND_URL"
echo "🔧 Backend URL: $BACKEND_URL"
echo ""
echo "📋 Send these URLs to your manager for testing"
echo ""
echo "Press Ctrl+C to stop the tunnels"

# Keep script running
wait
