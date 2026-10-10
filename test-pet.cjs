const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1200, height: 800 });
  
  const states = ['sleep', 'wake', 'idle', 'think', 'talk', 'search', 'vision', 'doc', 'image', 'done', 'error', 'pet'];
  
  for (const s of states) {
    // Test desktop prototype
    await page.goto(`file://${path.join(__dirname, 'nazaverse-prototype.html')}`);
    await page.evaluate(`
      document.querySelector('#gear').click();
      setTimeout(() => document.querySelector('[data-act="lab"][data-v="${s}"]').click(), 100);
    `);
    await page.waitForTimeout(600);
    await page.screenshot({ path: `screenshot-proto-pet-${s}.png` });
    
    // Test app
    await page.goto('http://localhost:5173/');
    await page.evaluate(`
      document.querySelector('#gear').click();
      setTimeout(() => document.querySelector('[data-act="lab"][data-v="${s}"]').click(), 100);
    `);
    await page.waitForTimeout(600);
    await page.screenshot({ path: `screenshot-app-pet-${s}.png` });
  }

  await browser.close();
  console.log('Pet state screenshots saved!');
})();

