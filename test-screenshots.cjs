const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  
  await page.goto('http://localhost:5174/');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshot-phase0.png' });
  
  // Click to trigger phase 1
  await page.click('body');
  
  // Phase 1: 0-2s (capture at 1s = middle)
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshot-phase1.png' });
  
  // Phase 2: 2-4.5s (capture at 3.25s = middle)
  await page.waitForTimeout(2250);
  await page.screenshot({ path: 'screenshot-phase2.png' });
  
  // Phase 3: 4.5-8.5s (capture at 6.5s = middle)
  await page.waitForTimeout(3250);
  await page.screenshot({ path: 'screenshot-phase3.png' });
  
  await browser.close();
})();
