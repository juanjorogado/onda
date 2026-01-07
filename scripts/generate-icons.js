import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// Script para generar iconos desde SVG
// Requiere: npm install sharp --save-dev

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateIcons() {
  try {
    const svgPath = path.join(__dirname, '../public/logo.svg');
    
    const sizes = [
      { name: 'favicon-16.png', size: 16 },
      { name: 'favicon-32.png', size: 32 },
      { name: 'apple-touch-icon.png', size: 180 },
      { name: 'icon-192.png', size: 192 },
      { name: 'icon-512.png', size: 512 },
    ];
    
    for (const { name, size } of sizes) {
      await sharp(svgPath)
        .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png()
        .toFile(path.join(__dirname, '../public', name));
      console.log(`✓ Generado ${name} (${size}x${size})`);
    }
    
    // Generar favicon.ico desde el PNG de 32x32
    const ico32 = await sharp(svgPath)
      .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toBuffer();
    
    // Para ICO necesitaríamos una librería adicional, por ahora copiamos el PNG
    fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), ico32);
    console.log('✓ Generado favicon.ico (usando PNG de 32x32)');
    
    console.log('\n✓ Todos los iconos generados exitosamente');
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('Error: sharp no está instalado.');
      console.error('Por favor ejecuta: npm install sharp --save-dev');
      process.exit(1);
    } else {
      console.error('Error generando iconos:', error);
      process.exit(1);
    }
  }
}

generateIcons();
