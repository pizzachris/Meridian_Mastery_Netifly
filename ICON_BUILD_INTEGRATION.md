# Triskelion Icon Integration for Builds

To ensure your triskelion icon is properly included in builds and deployments, follow these steps:

## 1. Update package.json Scripts

Add these scripts to your package.json file to include icon handling during build:

```json
"scripts": {
  "build": "vite build && npm run copy-icons",
  "copy-icons": "node copy-icons.js",
  "preview": "vite preview"
}
```

## 2. Create Copy Icons Script

Create a new file called `copy-icons.js` in your project root:

```javascript
// File: copy-icons.js
const fs = require('fs');
const path = require('path');

// Ensure the icons directory exists in the dist folder
const iconDir = path.join(__dirname, 'dist', 'icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Copy SVG icons
const svgFiles = ['triskelion.svg', 'apple-touch-icon.svg'];
svgFiles.forEach(file => {
  const sourcePath = path.join(__dirname, 'public', 'icons', file);
  const destPath = path.join(iconDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${file} to dist/icons/`);
  } else {
    console.warn(`Warning: ${file} not found in public/icons/`);
  }
});

// Copy PNG icons if they exist
const pngFiles = [
  'triskelion-192.png', 
  'triskelion-512.png', 
  'apple-touch-icon.png',
  'favicon-32x32.png',
  'favicon-16x16.png'
];

pngFiles.forEach(file => {
  const sourcePath = path.join(__dirname, 'public', 'icons', file);
  const destPath = path.join(iconDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${file} to dist/icons/`);
  } else {
    console.warn(`Warning: ${file} not found in public/icons/ - you may need to generate it`);
  }
});

console.log('Icon copying complete!');
```

## 3. Update vite.config.js

Make sure your Vite configuration properly handles the icons:

```javascript
// In your vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      // Ensure icon files are treated correctly
      output: {
        assetFileNames: (assetInfo) => {
          // Keep SVG and PNG files in their original paths
          if (/\.(svg|png)$/.test(assetInfo.name)) {
            return '[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  }
})
```

## 4. Build and Deploy

After setting up the icon files and configurations:

1. Run `npm run build` to create a production build with icons
2. Deploy the resulting `dist` folder to your hosting provider
3. Test on mobile devices by adding to homescreen

## Troubleshooting

If icons don't appear in the production build:

1. Check that the files in `public/icons/` exist
2. Verify that paths in `manifest.json` and `index.html` match your actual file structure
3. Use browser dev tools to check for 404 errors on icon files
4. Try clearing the browser cache or using incognito mode for testing
