import { test } from '../../fixtures';

test.describe('Automation Practice Form', () => {
  test('should submit form successfully with valid data', async ({ automationFormPage }) => {
    await automationFormPage.open();

    // Điền thông tin cá nhân
    await automationFormPage.fillPersonalInfo({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      mobile: '0123456789',
      address: '123 Main Street',
    });

    // Chọn Gender & Hobby
    await automationFormPage.selectGender('Male');
    await automationFormPage.selectHobby('Sports');

    // Submit Form
    await automationFormPage.submit();

    // Verify Modal hiển thị thành công
    await automationFormPage.expectSubmissionSuccess();
  });
});
