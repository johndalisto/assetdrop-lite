#!/bin/bash

echo "🔧 Updating API URLs for remote access..."

# Update AuthContext.tsx
sed -i '' 's|http://localhost:3001|https://halifax-librarian-closest-consisting.trycloudflare.com|g' frontend/src/contexts/AuthContext.tsx

# Update AdminDashboard.tsx
sed -i '' 's|http://localhost:3001|https://halifax-librarian-closest-consisting.trycloudflare.com|g' frontend/src/pages/AdminDashboard.tsx

# Update ClientDashboard.tsx
sed -i '' 's|http://localhost:3001|https://halifax-librarian-closest-consisting.trycloudflare.com|g' frontend/src/pages/ClientDashboard.tsx

# Update any other files that might have localhost:3001
find frontend/src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's|http://localhost:3001|https://halifax-librarian-closest-consisting.trycloudflare.com|g'

echo "✅ API URLs updated for remote access"
echo "🌐 Frontend URL: https://printers-opportunity-available-stainless.trycloudflare.com"
echo "🔧 Backend URL: https://halifax-librarian-closest-consisting.trycloudflare.com"
echo ""
echo "📧 Send the email to your manager with these URLs!"
