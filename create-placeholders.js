const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function createPlaceholders() {
  const assetsDir = path.join(__dirname, 'public', 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // Create temple_04.jpg
  await sharp({
    create: {
      width: 800,
      height: 600,
      channels: 4,
      background: { r: 255, g: 165, b: 0, alpha: 1 } // Orange background
    }
  })
  .jpeg()
  .toFile(path.join(assetsDir, 'temple_04.jpg'));

  // Create cinematic_temple_bg.png
  await sharp({
    create: {
      width: 1920,
      height: 1080,
      channels: 4,
      background: { r: 50, g: 50, b: 50, alpha: 1 } // Dark background
    }
  })
  .png()
  .toFile(path.join(assetsDir, 'cinematic_temple_bg.png'));

  // Create qr.png
  await sharp({
    create: {
      width: 300,
      height: 300,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 } // White background
    }
  })
  .png()
  .toFile(path.join(assetsDir, 'qr.png'));

  // Create dummy audio file
  fs.writeFileSync(path.join(assetsDir, 'hanumanji_aarti.m4a'), 'dummy audio');
  
  console.log("Placeholder assets created successfully!");
}

createPlaceholders().catch(console.error);
