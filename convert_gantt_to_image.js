// Script to convert Gantt Chart HTML to PNG
// Run: node convert_gantt_to_image.js

const puppeteer = require('puppeteer');
const path = require('path');

async function convertHtmlToPng() {
  console.log('Starting conversion...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set viewport to capture full width
  await page.setViewport({
    width: 1400,
    height: 2000,
    deviceScaleFactor: 2 // Higher quality
  });
  
  // Load the HTML file
  const htmlPath = path.join(__dirname, 'RTX_Cinema_Gantt_Chart.html');
  await page.goto(`file://${htmlPath}`, {
    waitUntil: 'networkidle0'
  });
  
  // Wait for content to render
  await page.waitForTimeout(1000);
  
  // Take screenshot
  await page.screenshot({
    path: 'RTX_Cinema_Gantt_Chart.png',
    fullPage: true,
    type: 'png'
  });
  
  console.log('✅ Screenshot saved as RTX_Cinema_Gantt_Chart.png');
  
  await browser.close();
}

convertHtmlToPng().catch(console.error);
