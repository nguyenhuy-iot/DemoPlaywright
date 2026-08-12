import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../../../shared/pages/base.page';

export interface AutomationFormData {
  firstName: string;
  lastName: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  hobbies: string[];
  address: string;
}

export class AutomationFormPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly mobileInput: Locator;
  readonly addressInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);

    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.emailInput = page.getByPlaceholder('name@example.com');
    this.mobileInput = page.getByPlaceholder('Mobile Number');
    this.addressInput = page.getByPlaceholder('Current Address');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  async open() {
    await this.page.goto('https://demoqa.com/automation-practice-form');
  }

  async fillPersonalInfo(data: Omit<AutomationFormData, 'gender' | 'hobbies'>) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.mobileInput.fill(data.mobile);
    await this.addressInput.fill(data.address);
  }

  async selectGender(gender: AutomationFormData['gender']) {
    await this.page.getByText(gender, { exact: true }).click();
  }

  async selectHobby(hobby: string) {
    await this.page.getByText(hobby, { exact: true }).click();
  }

  async submit() {
    await this.submitButton.click();
  }

  async expectSubmissionSuccess() {
    await expect(this.page.getByText('Thanks for submitting the form')).toBeVisible();
  }
}
