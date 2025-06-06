# Meridian Mastery PWA - Deployment Script (PowerShell)

Write-Host "🚀 Meridian Mastery PWA Deployment Script" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

Write-Host "📋 Pre-deployment checks..." -ForegroundColor Yellow

# Check Node.js
Write-Host "✓ Checking Node.js version..." -ForegroundColor Green
node --version

# Check npm
Write-Host "✓ Checking npm version..." -ForegroundColor Green
npm --version

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Run build
Write-Host "🔨 Building project..." -ForegroundColor Yellow
npm run build

# Check if build was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📁 Build output in 'dist' directory" -ForegroundColor Cyan
    Write-Host "📱 PWA ready for deployment" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🌐 Deployment options:" -ForegroundColor Magenta
    Write-Host "1. GitHub Pages: Push to GitHub and enable Pages" -ForegroundColor White
    Write-Host "2. Netlify: Drag 'dist' folder to netlify.com/drop" -ForegroundColor White
    Write-Host "3. Vercel: Import repository at vercel.com" -ForegroundColor White
    Write-Host ""
    Write-Host "📊 Build stats:" -ForegroundColor Yellow
    Get-ChildItem -Path "dist" -Recurse | Format-Table Name, Length, LastWriteTime
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
