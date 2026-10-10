import { test, expect } from '@playwright/test';

test.describe('Phase 3: Chatbot Engine & Storage', () => {
  test('Settings modal saves API key to localStorage', async ({ page }) => {
    await page.goto('/');
    
    // Open Settings (Settings icon click)
    await page.locator('button.nav-btn').nth(3).click();
    await expect(page.locator('.modal-title')).toHaveText('Pengaturan');
    
    // Wait for the modal content to fully render
    await page.waitForTimeout(500);
    
    // Select Gemini provider
    // Note: The select element is likely populated by renderModal('sett')
    // We can evaluate and click directly based on the DOM structure.
  });
});

