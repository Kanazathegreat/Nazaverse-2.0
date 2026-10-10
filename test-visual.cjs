const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Test desktop prototype
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.goto(`file://${path.join(__dirname, 'nazaverse-prototype.html')}`);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshot-proto-desktop.png' });
  
  // Test desktop app
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshot-app-desktop.png' });

  // Test mobile prototype
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`file://${path.join(__dirname, 'nazaverse-prototype.html')}`);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshot-proto-mobile.png' });

  // Test mobile app
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshot-app-mobile.png' });
  
  await browser.close();
  console.log('Screenshots saved!');
})();
