const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const [urlArg, fileNameArg] = process.argv.slice(2);

if (!urlArg) {
  console.error('Usage: node scripts/generate-qr.js "<URL>" [file-name]');
  process.exit(1);
}

let normalizedUrl;
try {
  normalizedUrl = new URL(urlArg).toString();
} catch (error) {
  console.error('Invalid URL. Example: https://echochic.org/cleanup/brooklyn');
  process.exit(1);
}

const safeName = String(fileNameArg || 'cleanup-qr')
  .trim()
  .replace(/[^a-zA-Z0-9-_]/g, '-')
  .replace(/-+/g, '-')
  .toLowerCase();

const outputDir = path.join(__dirname, '..', 'generated-qr');
const outputPath = path.join(outputDir, `${safeName || 'cleanup-qr'}.png`);

fs.mkdirSync(outputDir, { recursive: true });

QRCode.toFile(outputPath, normalizedUrl, {
  type: 'png',
  width: 512,
  margin: 1,
  errorCorrectionLevel: 'H'
})
  .then(() => {
    console.log(`QR code created successfully:\n${outputPath}`);
  })
  .catch((error) => {
    console.error(`Failed to generate QR code: ${error.message}`);
    process.exit(1);
  });
