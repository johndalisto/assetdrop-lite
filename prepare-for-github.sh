#!/bin/bash

echo "🚀 Preparing AssetDrop for GitHub deployment..."
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if .gitignore exists
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build
/dist

# Misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Uploads
backend/uploads/*
!backend/uploads/.gitkeep

# Environment variables
.env
.env.local

# Temporary files
*.tmp
*.temp
/tmp
/temp

# Cloudflare tunnel logs
*-tunnel.log
ngrok*.log
frontend-tunnel.log
backend-tunnel.log

# OS
Thumbs.db
.DS_Store
EOF
    echo "✅ .gitignore created"
else
    echo "✅ .gitignore already exists"
fi

# Create uploads directory placeholder if it doesn't exist
if [ ! -f "backend/uploads/.gitkeep" ]; then
    mkdir -p backend/uploads
    touch backend/uploads/.gitkeep
    echo "✅ Created uploads directory placeholder"
fi

echo ""
echo "📋 Files ready for GitHub!"
echo ""
echo "Next steps:"
echo "1. Create a repository on GitHub (github.com)"
echo "2. Run these commands:"
echo ""
echo "   git add ."
echo "   git commit -m 'Initial commit - AssetDrop Lite'"
echo "   git branch -M main"
echo "   git remote add origin https://github.com/YOUR_USERNAME/assetdrop-lite.git"
echo "   git push -u origin main"
echo ""
echo "3. Follow DEPLOYMENT_GUIDE.md for deployment instructions"
echo ""
echo "✅ Preparation complete!"
