#!/bin/bash
# Meridian Mastery PWA - Deployment Script

echo "🚀 Meridian Mastery PWA Deployment Script"
echo "========================================="

echo "📋 Pre-deployment checks..."

# Check Node.js
echo "✓ Checking Node.js version..."
node --version

# Check npm
echo "✓ Checking npm version..."
npm --version

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run build
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📁 Build output in 'dist' directory"
    echo "📱 PWA ready for deployment"
    echo ""
    echo "🌐 Deployment options:"
    echo "1. GitHub Pages: Push to GitHub and enable Pages"
    echo "2. Netlify: Drag 'dist' folder to netlify.com/drop"
    echo "3. Vercel: Import repository at vercel.com"
    echo ""
    echo "📊 Build stats:"
    ls -la dist/
else
    echo "❌ Build failed!"
    exit 1
fi
