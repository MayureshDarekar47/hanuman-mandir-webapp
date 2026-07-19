const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <circle cx="256" cy="256" r="256" fill="#ea580c"/>
  <text x="50%" y="55%" font-family="sans-serif" font-weight="bold" font-size="320" fill="white" text-anchor="middle" dominant-baseline="middle">ॐ</text>
</svg>
`;

async function generateIcons() {
  const publicDir = path.join(__dirname, 'public');
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  const sizes = [48, 96, 192, 512];
  for (const size of sizes) {
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, `icon-${size}x${size}.png`));
  }
  
  await sharp(Buffer.from(svg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // Create favicon.ico for the Next.js app directory
  await sharp(Buffer.from(svg))
    .resize(32, 32)
    .png()
    .toFile(path.join(__dirname, 'app', 'favicon.ico'));
    
  console.log('Icons generated successfully!');
}

generateIcons().catch(console.error);
