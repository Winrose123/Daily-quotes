const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputSvg = path.join(__dirname, 'icons', 'base-icon.svg');

// Create splash screen
async function createSplashScreen() {
    const width = 2048;
    const height = 2048;
    
    await sharp(inputSvg)
        .resize(width, height)
        .composite([{
            input: Buffer.from(`
                <svg width="${width}" height="${height}">
                    <rect width="${width}" height="${height}" fill="#646CFF"/>
                    <text x="50%" y="50%" font-family="Arial" font-size="120" fill="white" text-anchor="middle">
                        Daily Quotes
                    </text>
                </svg>`),
            top: 0,
            left: 0,
        }])
        .toFile(path.join(__dirname, 'icons', 'splash.png'));
}

// Generate all icon sizes
async function generateIcons() {
    for (const size of sizes) {
        await sharp(inputSvg)
            .resize(size, size)
            .toFile(path.join(__dirname, 'icons', `icon-${size}x${size}.png`));
    }
    
    // Generate apple touch icon (180x180)
    await sharp(inputSvg)
        .resize(180, 180)
        .toFile(path.join(__dirname, 'icons', 'apple-touch-icon.png'));
        
    // Generate splash screen
    await createSplashScreen();
}

generateIcons().catch(console.error);
