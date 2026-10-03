#!/bin/bash
set -e

echo "============================================="
echo "🚀 Deploying Revly SaaS from GitHub"
echo "============================================="

# Ensure in correct directory
cd /var/www/revly

# Reset any local file alterations and pull latest code
echo "📥 Pulling latest changes from GitHub..."
git fetch origin main
git reset --hard origin/main

# Install dependencies (needed for Vite build)
echo "📦 Installing npm dependencies..."
npm install

# Build production bundle
echo "🔨 Building frontend with Vite..."
npm run build

# Restart/Reload PM2 service
echo "🔄 Reloading PM2 process 'revly'..."
pm2 reload revly || pm2 start server.js --name revly
pm2 save

echo "============================================="
echo "✅ Deployment completed successfully!"
echo "Website URL: https://revly.rasatech.in"
echo "============================================="
