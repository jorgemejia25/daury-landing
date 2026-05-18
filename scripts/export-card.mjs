import puppeteer from 'puppeteer';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dir = dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(__dir, '../public/business-card-print.html');
const outPath  = resolve(__dir, '../public/business-card.pdf');

if (!existsSync(htmlPath)) {
  console.error('No se encontró business-card-print.html en public/');
  process.exit(1);
}

console.log('Abriendo Chrome headless…');
const browser = await puppeteer.launch({ headless: true });
const page    = await browser.newPage();

// Cargar el HTML y esperar a que las fuentes de Google Fonts terminen
await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 30_000 });

// Dar un tick extra para que el render de las fuentes se estabilice
await new Promise(r => setTimeout(r, 600));

await page.pdf({
  path: outPath,
  width:  '85.6mm',
  height: '54mm',
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
});

await browser.close();
console.log(`✓ PDF generado → ${outPath}`);
