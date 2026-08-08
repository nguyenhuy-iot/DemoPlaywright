import { test, expect } from '@playwright/test';

test('Submit Automation Practice Form successfully', async ({ page }) => {
  await page.goto('https://demoqa.com/automation-practice-form');
  
  // Điền thông tin cá nhân
  await page.getByPlaceholder('First Name').fill('John');
  await page.getByPlaceholder('Last Name').fill('Doe');
  await page.getByPlaceholder('name@example.com').fill('john@example.com');
  
  // Chọn Gender & Mobile
  await page.getByText('Male', { exact: true }).click();
  await page.getByPlaceholder('Mobile Number').fill('0123456789');
  
  // Chọn Hobbies & Address
  await page.getByText('Sports').click();
  await page.getByPlaceholder('Current Address').fill('123 Main Street');
  
  // Submit Form
  await page.getByRole('button', { name: 'Submit' }).click();
  
  // Verify Modal hiển thị thành công
  await expect(page.getByText('Thanks for submitting the form')).toBeVisible();
});
