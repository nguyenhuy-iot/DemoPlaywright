import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('capture accessibility snapshot', async ({ page }) => {
  await page.goto('https://demoqa.com/automation-practice-form');
  
  // Capture the accessibility tree
  const snapshot = await page.accessibility.snapshot();
  
  // Define directory and file path
  const dir = '.playwright-cli';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  
  const filePath = path.join(dir, 'snapshot.json');
  
  // Save the snapshot (JSON format as a proxy for YML)
  fs.writeFileSync(filePath, JSON.stringify(snapshot, null, 2));
  console.log(`Snapshot saved to: ${filePath}`);
});
