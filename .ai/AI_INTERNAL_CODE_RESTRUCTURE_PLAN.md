> **[HISTORY NOTE]**: This plan describes the initial restructuring strategy. The project has since adopted the `DEMO/` directory structure. Please refer to `DEMO/` for the current codebase organization.

# AI Internal Code Restructure Plan

> Mục tiêu: biến codebase thành một cấu trúc **dễ đọc, dễ kiểm tra, dễ sửa và khó sửa sai đối với AI nội bộ**.
>
> **Nguyên tắc quan trọng:** AI nội bộ không được giả định là thông minh. Mọi yêu cầu phải được mô tả thành quy tắc rõ ràng, có ví dụ đúng/sai, có phạm vi file, có thứ tự thực hiện và có tiêu chí kiểm tra sau mỗi bước.

---

## 0. Mục tiêu cuối cùng

Codebase cần đạt được các mục tiêu sau:

1. AI biết **file nào chịu trách nhiệm cho việc gì**.
2. AI biết **code nào được phép đặt ở đâu**.
3. AI biết **không được sửa trực tiếp tầng nào**.
4. AI có thể tìm từ:
   - test/spec
   - business flow
   - Page Object
   - component
   - locator
   - test data
5. AI có thể refactor mà không làm thay đổi behavior.
6. AI có thể tự kiểm tra thay đổi bằng test/lint/typecheck.
7. Khi gặp code chưa rõ, AI phải **dừng và báo cáo**, không tự suy đoán.
8. Mỗi thay đổi phải nhỏ, có thể review và rollback.
9. Không cho AI tự ý tạo abstraction mới nếu chưa có pattern tương ứng.
10. Không cho AI "tiện tay" sửa các file ngoài phạm vi task.

---

# 1. Vấn đề hiện tại cần cải thiện

## 1.1. Architecture chưa đồng nhất

Hiện project có POM, fixtures, specs và test-data nhưng một số test vẫn thao tác trực tiếp với `page`.

### Không được làm

```typescript
test('submit form', async ({ page }) => {
  await page.goto('/automation-practice-form');

  await page.getByPlaceholder('First Name').fill('John');
  await page.getByPlaceholder('Last Name').fill('Doe');

  await page.getByRole('button', { name: 'Submit' }).click();
});
```

### Phải làm

```typescript
test('submit form', async ({ automationFormPage }) => {
  await automationFormPage.open();

  await automationFormPage.fillPersonalInfo({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    mobile: '0123456789',
    address: '123 Main Street',
  });

  await automationFormPage.selectGender('Male');
  await automationFormPage.selectHobby('Sports');
  await automationFormPage.submit();

  await automationFormPage.expectSubmissionSuccess();
});
```

### Rule cho AI

> Trong `tests/specs/**`, không được gọi trực tiếp:
>
> - `page.locator(...)`
> - `page.getByRole(...)`
> - `page.getByText(...)`
> - `page.getByPlaceholder(...)`
> - `page.click(...)`
> - `page.fill(...)`
> - `page.goto(...)`
>
> Ngoại lệ chỉ được phép khi task yêu cầu rõ ràng hoặc đang viết/debug infrastructure.

---

# 2. Chuẩn hóa structure

Đề xuất structure:

```text
project/
│
├── .ai/
│   ├── project.yaml
│   ├── architecture.md
│   ├── conventions.md
│   ├── rules.md
│   └── flows/
│       ├── demoqa-form.md
│       └── todo.md
│
├── tests/
│   ├── fixtures/
│   │   ├── base.fixture.ts
│   │   └── index.ts
│   │
│   ├── pages/
│   │   ├── base.page.ts
│   │   ├── demoqa/
│   │   │   └── automation-form.page.ts
│   │   ├── todomvc/
│   │   │   └── todo.page.ts
│   │   └── playwright/
│   │       ├── home.page.ts
│   │       └── docs.page.ts
│   │
│   ├── components/
│   │   └── ...
│   │
│   ├── specs/
│   │   ├── demoqa/
│   │   ├── todomvc/
│   │   └── playwright/
│   │
│   ├── test-data/
│   │   ├── demoqa/
│   │   └── todomvc/
│   │
│   └── support/
│       ├── constants.ts
│       └── types.ts
│
├── tools/
│   ├── capture-snapshot.ts
│   └── build-project-index.ts
│
├── docs/
├── specs/
├── GEMINI.md
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

## 2.1. Rule mapping

| Folder             | Chứa                                                     | Không chứa                     |
| ------------------ | -------------------------------------------------------- | ------------------------------ |
| `tests/specs`      | test scenario, business intent, assertion ở mức scenario | raw locator, selector          |
| `tests/pages`      | Page Object, locator, business action của page           | test case                      |
| `tests/components` | UI component dùng lại                                    | full test                      |
| `tests/fixtures`   | dependency injection                                     | business scenario              |
| `tests/test-data`  | data test                                                | locator                        |
| `tests/support`    | type/constants dùng chung                                | page action                    |
| `tools`            | script/tool phục vụ development                          | Playwright test                |
| `.ai`              | context/rules cho AI                                     | production/test implementation |

---

# 3. Quy tắc bắt buộc cho AI

Đây là phần quan trọng nhất.

AI phải đọc `.ai/rules.md` trước khi sửa code.

## Rule 01 — Không sửa ngoài scope

Nếu task là:

```text
Refactor DemoQA automation form
```

AI chỉ được ưu tiên sửa:

```text
tests/pages/demoqa/**
tests/specs/demoqa/**
tests/fixtures/**
tests/test-data/demoqa/**
```

Không tự ý sửa:

```text
package.json
playwright.config.ts
GEMINI.md
tools/**
```

trừ khi thay đổi đó thực sự cần thiết và phải báo cáo.

---

## Rule 02 — Không thay đổi behavior khi refactor

Refactor nghĩa là:

```text
same behavior
+
better structure
```

Không phải:

```text
new behavior
```

### Ví dụ

Trước:

```typescript
await page.getByRole('button', { name: 'Submit' }).click();
```

Sau:

```typescript
await this.submitButton.click();
```

Đây là refactor hợp lệ.

Nhưng:

```typescript
await this.submitButton.click();
await this.page.waitForTimeout(1000);
```

là thay đổi behavior và không được thêm nếu không có lý do rõ ràng.

---

## Rule 03 — Không tạo abstraction nếu chưa cần

Không biến:

```typescript
await this.firstNameInput.fill(data.firstName);
```

thành:

```typescript
await this.fillInput(this.firstNameInput, data.firstName);
```

chỉ để giảm một dòng code.

Chỉ tạo helper khi:

1. logic xuất hiện ít nhất 2-3 nơi;
2. logic thực sự giống nhau;
3. abstraction làm code dễ hiểu hơn;
4. tên helper mô tả rõ business behavior.

---

## Rule 04 — Locator thuộc Page Object

### Sai

```typescript
test('login', async ({ page }) => {
  await page.getByPlaceholder('Email').fill('a@test.com');
});
```

### Đúng

```typescript
class LoginPage {
  readonly emailInput = this.page.getByPlaceholder('Email');

  async enterEmail(email: string) {
    await this.emailInput.fill(email);
  }
}
```

Spec:

```typescript
await loginPage.enterEmail('a@test.com');
```

---

# 4. Page Object phải mang semantic business action

## Không ưu tiên

```typescript
clickLink(name: string)
fill(value: string)
click()
select(value: string)
```

Các method này quá generic.

## Ưu tiên

```typescript
goToInstallation();
goToWritingTests();
fillUserInformation();
selectGender();
selectHobby();
submitForm();
expectSubmissionSuccess();
```

### Nguyên tắc

> Nếu nhìn tên method mà người không đọc implementation vẫn hiểu hành động business, method đó tốt.

---

# 5. Ví dụ chuẩn cho DemoQA Form

## File

```text
tests/pages/demoqa/automation-form.page.ts
```

## Interface

```typescript
export interface AutomationFormData {
  firstName: string;
  lastName: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  hobbies: string[];
  address: string;
}
```

## Page Object

```typescript
import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../base.page';

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
    await this.page.goto('/automation-practice-form');
  }

  async fillPersonalInfo(data: AutomationFormData) {
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
```

## Spec

```typescript
import { test } from '../fixtures';

test('submit automation practice form', async ({ automationFormPage }) => {
  await automationFormPage.open();

  await automationFormPage.fillPersonalInfo({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    gender: 'Male',
    mobile: '0123456789',
    hobbies: ['Sports'],
    address: '123 Main Street',
  });

  await automationFormPage.selectGender('Male');
  await automationFormPage.selectHobby('Sports');
  await automationFormPage.submit();

  await automationFormPage.expectSubmissionSuccess();
});
```

---

# 6. Tách Flow/Task khỏi Page Object khi cần

Không bắt buộc mọi project phải có flow layer.

Chỉ thêm khi một business flow sử dụng nhiều Page Object.

## Khi không cần Flow

```text
spec
  ↓
page
```

Ví dụ:

```typescript
await todoMvcPage.addTodo('Buy milk');
await todoMvcPage.toggleTodo('Buy milk');
```

## Khi cần Flow

```text
spec
  ↓
flow/task
  ↓
page
  ↓
component
```

Ví dụ:

```typescript
await registrationFlow.registerUser(user);
```

Implementation:

```typescript
class RegistrationFlow {
  constructor(
    private readonly registrationPage: RegistrationPage,
    private readonly confirmationPage: ConfirmationPage
  ) {}

  async registerUser(user: User) {
    await this.registrationPage.open();
    await this.registrationPage.fillUserInformation(user);
    await this.registrationPage.submit();
    await this.confirmationPage.expectRegistrationSuccess();
  }
}
```

### Rule cho AI

Không tạo Flow chỉ vì muốn code "đẹp".

Chỉ tạo Flow nếu:

- flow có nhiều bước;
- flow sử dụng nhiều page;
- flow được reuse;
- flow có business meaning rõ ràng.

---

# 7. BasePage phải cực mỏng

## Nên

```typescript
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async open(path: string) {
    await this.page.goto(path);
  }
}
```

## Không nên

```typescript
class BasePage {
  async click(...)
  async fill(...)
  async select(...)
  async wait(...)
  async retry(...)
  async screenshot(...)
  async apiCall(...)
  async parse(...)
}
```

### Rule

> Không biến `BasePage` thành God Object.

Playwright đã có auto-waiting và web-first assertions.

Không tạo helper:

```typescript
waitForElement();
```

nếu chỉ là wrapper cho:

```typescript
locator.waitFor();
```

và không có thêm business value.

---

# 8. Không dùng hard wait

## Cấm

```typescript
await page.waitForTimeout(3000);
```

## Ưu tiên

```typescript
await expect(page.getByText('Success')).toBeVisible();
```

hoặc:

```typescript
await locator.waitFor({ state: 'visible' });
```

### AI phải kiểm tra

Nếu thấy:

```typescript
waitForTimeout;
```

AI phải:

1. xác định tại sao cần chờ;
2. tìm condition thực tế;
3. thay bằng wait/assertion phù hợp;
4. nếu không chắc, không tự sửa và báo cáo.

---

# 9. Base URL

Trong `playwright.config.ts`:

```typescript
use: {
  baseURL: 'https://demoqa.com',
  trace: 'retain-on-failure',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
}
```

Sau đó:

```typescript
await page.goto('/automation-practice-form');
```

Không lặp lại:

```typescript
await page.goto('https://demoqa.com/automation-practice-form');
```

### Lợi ích

AI biết:

```text
environment = demoqa
```

thay vì phải phân tích URL trong từng test.

---

# 10. Artifact không phải test

Nếu file chỉ dùng để thu thập context/snapshot:

```text
capture-snapshot.spec.ts
```

không nên nằm trong `tests/specs`.

Chuyển thành:

```text
tools/capture-snapshot.ts
```

hoặc:

```text
scripts/capture-snapshot.ts
```

### Rule

> File trong `tests/specs` phải là test thực sự.

Không dùng Playwright test runner để chạy utility nếu utility không phải test.

---

# 11. Fixture phải là dependency contract

Ví dụ:

```typescript
export type ProjectFixtures = {
  todoMvcPage: TodoMvcPage;
  playwrightDocsPage: PlaywrightDocsPage;
  playwrightHomePage: PlaywrightHomePage;
  automationFormPage: AutomationFormPage;
};
```

Fixture:

```typescript
automationFormPage: async ({ page }, use) => {
  await use(new AutomationFormPage(page));
},
```

Spec:

```typescript
test('submit form', async ({ automationFormPage }) => {
  // ...
});
```

### Rule cho AI

Không tạo Page Object thủ công trong spec:

```typescript
const pageObject = new AutomationFormPage(page);
```

Nếu fixture đã tồn tại, phải dùng fixture.

---

# 12. Test data phải strongly typed

## Không ưu tiên

```typescript
import users from '../test-data/users.json';
```

và sau đó sử dụng trực tiếp ở mọi nơi.

## Ưu tiên

```typescript
export interface User {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
}

export const validUser: User = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  mobile: '0123456789',
};
```

Nếu bắt buộc dùng JSON:

```text
JSON
 ↓
data loader
 ↓
typed model
 ↓
spec
```

### Rule

Spec không được tự hiểu schema của JSON bằng cách đoán.

Schema phải được định nghĩa rõ bằng TypeScript type/interface.

---

# 13. Naming convention cho AI

## File

```text
automation-form.page.ts
automation-form.spec.ts
todo.page.ts
todo.spec.ts
```

## Class

```text
AutomationFormPage
TodoPage
LoginPage
```

## Method

### Tốt

```text
open()
fillPersonalInfo()
selectGender()
selectHobby()
submit()
expectSubmissionSuccess()
goToInstallation()
goToWritingTests()
```

### Không tốt

```text
doAction()
handle()
process()
clickSomething()
fill()
run()
execute()
```

### Rule

Tên phải trả lời được:

> Method này làm gì?

Nếu không trả lời được từ tên method, AI phải xem xét đổi tên.

---

# 14. Không trộn các trách nhiệm

Một file spec không nên đồng thời chứa:

```text
navigation
locator
test data definition
business action
assertion implementation
utility
```

## Phân chia

```text
Spec
  → scenario

Flow
  → business workflow

Page
  → page interaction

Component
  → reusable UI interaction

Fixture
  → dependency injection

Test Data
  → input

Support
  → shared type/constant
```

---

# 15. Accessibility/semantic locator

Ưu tiên theo thứ tự:

1. `getByRole`
2. `getByLabel`
3. `getByPlaceholder`
4. `getByText`
5. `getByTestId`
6. CSS/XPath cuối cùng

## Ví dụ tốt

```typescript
page.getByRole('button', { name: 'Submit' });
```

## Kém ưu tiên

```typescript
page.locator('#submit');
```

## Không được tự ý đổi locator chỉ vì "thấy đẹp hơn"

Khi refactor:

```typescript
page.locator('#submit');
```

thành:

```typescript
page.getByRole('button', { name: 'Submit' });
```

AI phải xác minh hai locator thực sự trỏ tới cùng element.

Nếu không chắc:

```text
DO NOT CHANGE
```

và báo cáo.

---

# 16. AI không được đoán

Đây là rule bắt buộc.

Nếu AI gặp:

```typescript
page.locator('.foo');
```

và không biết `.foo` là gì:

### Không được

Tự đổi thành:

```typescript
page.getByRole('button', { name: 'Submit' });
```

### Phải

1. tìm HTML;
2. tìm snapshot;
3. tìm usage;
4. tìm test liên quan;
5. nếu vẫn không đủ thông tin → giữ nguyên và báo cáo.

---

# 17. Quy trình refactor bắt buộc

AI phải thực hiện đúng thứ tự.

## Step 1 — Scan

Đọc:

```text
GEMINI.md
.ai/project.yaml
.ai/architecture.md
.ai/rules.md
playwright.config.ts
package.json
tsconfig.json
```

Sau đó scan:

```text
tests/
```

## Step 2 — Tạo inventory

AI phải tạo danh sách:

```text
Specs:
- automation-form.spec.ts
- todo.spec.ts

Pages:
- TodoPage
- PlaywrightDocsPage

Fixtures:
- todoMvcPage
- playwrightDocsPage

Test data:
- users.json
```

## Step 3 — Mapping

Tạo mapping:

```text
automation-form.spec.ts
    ↓
??? Page Object
    ↓
??? Fixture
```

Nếu thiếu Page Object:

```text
ACTION REQUIRED:
Create Page Object
```

## Step 4 — Refactor từng spec

Mỗi lần chỉ refactor 1 spec.

Không refactor toàn bộ repository trong một lần.

## Step 5 — Chạy kiểm tra

Sau mỗi file:

```bash
npx playwright test <file>
```

Nếu project có:

```bash
npm run lint
npm run typecheck
```

thì chạy thêm.

## Step 6 — Kiểm tra diff

AI phải xem:

```bash
git diff
```

và xác nhận:

```text
No unrelated changes
No behavior change
No accidental file deletion
No new dependency unless required
```

---

# 18. Refactor theo từng task nhỏ

## Không giao AI task kiểu

```text
Refactor toàn bộ project cho đẹp.
```

Task này quá rộng.

## Nên giao

```text
Task:
Refactor tests/specs/demoqa/automation-form.spec.ts

Requirements:
1. Không thay đổi test behavior.
2. Không thay đổi assertion.
3. Không thay đổi test data.
4. Di chuyển locator vào AutomationFormPage.
5. Tạo fixture automationFormPage nếu chưa có.
6. Spec không được dùng raw locator.
7. Method Page Object phải có semantic naming.
8. Chạy test sau khi sửa.
9. Chỉ sửa các file cần thiết.
10. Trả về danh sách file đã thay đổi.
```

---

# 19. Definition of Done cho mỗi refactor

AI chỉ được đánh dấu DONE khi tất cả điều kiện sau đúng:

```text
[ ] Test vẫn tồn tại.
[ ] Test vẫn có cùng mục đích.
[ ] Assertion không bị loại bỏ.
[ ] Không có raw locator trong spec.
[ ] Locator nằm trong Page Object.
[ ] Page Object được inject bằng fixture.
[ ] Naming có semantic meaning.
[ ] Không có waitForTimeout mới.
[ ] Không có code duplication mới.
[ ] TypeScript compile thành công.
[ ] Test chạy thành công.
[ ] Git diff chỉ chứa thay đổi cần thiết.
```

Nếu một checkbox fail:

```text
STATUS = NOT DONE
```

---

# 20. AI phải report kết quả theo format cố định

Sau mỗi task, AI trả:

```text
## Refactor Result

Status:
PASS | PARTIAL | BLOCKED | FAILED

Files changed:
- tests/pages/demoqa/automation-form.page.ts
- tests/fixtures/base.fixture.ts
- tests/specs/demoqa/automation-form.spec.ts

Files not changed:
- playwright.config.ts
- package.json

Changes:
1. Moved locators from spec to Page Object.
2. Added semantic business actions.
3. Added automationFormPage fixture.
4. Kept assertions unchanged.

Validation:
- TypeScript: PASS
- Playwright test: PASS
- Lint: PASS

Behavior changes:
None.

Remaining issues:
None.
```

---

# 21. Nếu bị lỗi thì không tự chữa vô hạn

Ví dụ test fail.

AI chỉ được thử tối đa một số vòng đã quy định, ví dụ:

```text
MAX_FIX_ATTEMPTS = 3
```

Sau 3 lần:

```text
STATUS = BLOCKED
```

và report:

```text
Failure:
Expected "Thanks for submitting the form" to be visible.

Attempts:
1. Checked locator.
2. Checked page object.
3. Re-ran test.

Conclusion:
Unable to determine root cause safely.
No further changes made.
```

Không được sửa lung tung chỉ để test xanh.

---

# 22. Project Context Manifest

Tạo:

```text
.ai/project.yaml
```

Ví dụ:

```yaml
name: DemoPlaywright

language: typescript
framework: playwright

architecture:
  pattern: page-object-model
  flow_layer: optional
  component_layer: optional

directories:
  specs: tests/specs
  pages: tests/pages
  components: tests/components
  fixtures: tests/fixtures
  test_data: tests/test-data
  support: tests/support
  tools: tools

rules:
  specs_cannot_use_raw_locators: true
  locators_must_be_in_page_objects: true
  page_objects_must_be_injected_by_fixture: true
  test_data_must_be_typed: true
  no_wait_for_timeout: true
  no_unrelated_changes: true

validation:
  run_typecheck: true
  run_lint: true
  run_test_after_change: true

agent_behavior:
  max_fix_attempts: 3
  ask_before_architecture_change: true
  do_not_guess: true
  stop_on_ambiguous_requirement: true
```

---

# 23. Architecture documentation cho AI

Tạo:

```text
.ai/architecture.md
```

Nội dung tối thiểu:

```markdown
# Architecture

## Dependency direction

Spec
↓
Flow
↓
Page
↓
Component
↓
Playwright

## Rules

- Spec does not own locators.
- Page owns locators.
- Fixture creates Page Objects.
- Test data is separate from interaction logic.
- Components are reusable UI units.
- Tools are not tests.
```

---

# 24. Flow documentation

Ví dụ:

```text
.ai/flows/demoqa-form.md
```

```markdown
# DemoQA Automation Form

## Entry point

tests/specs/demoqa/automation-form.spec.ts

## Page

tests/pages/demoqa/automation-form.page.ts

## Fixture

automationFormPage

## Business flow

1. Open automation form.
2. Fill personal information.
3. Select gender.
4. Select hobby.
5. Submit form.
6. Verify successful submission.

## Important elements

- First Name
- Last Name
- Email
- Gender
- Mobile
- Hobbies
- Address
- Submit

## Do not

- Add locators to spec.
- Hardcode URL in spec.
- Add waitForTimeout.
```

---

# 25. AI Context Graph

Mục tiêu là AI có thể đi theo relationship:

```text
Requirement
    ↓
Spec
    ↓
Flow
    ↓
Page
    ↓
Component
    ↓
Locator
    ↓
Browser
```

Ví dụ:

```text
automation-form.spec.ts
        │
        │ uses
        ↓
AutomationFormPage
        │
        ├── firstNameInput
        ├── lastNameInput
        ├── emailInput
        ├── gender
        └── submitButton
```

Khi user hỏi:

> Submit form được test ở đâu?

AI có thể trả:

```text
tests/specs/demoqa/automation-form.spec.ts
        ↓
AutomationFormPage.submit()
```

Không cần dựa hoàn toàn vào semantic search.

---

# 26. Retrieval cho AI

Nếu xây Context Engine, nên có ít nhất 4 loại search:

```text
User question
      ↓
Intent
      ↓
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Symbol       │ Semantic     │ Graph        │ Git          │
│ Search       │ Search       │ Search       │ History      │
└──────────────┴──────────────┴──────────────┴──────────────┘
      ↓
Context Ranker
      ↓
AI Agent
```

## Symbol Search

Dùng cho:

```text
AutomationFormPage
submit()
firstNameInput
```

## Semantic Search

Dùng cho:

```text
"form submit"
"login flow"
```

## Graph Search

Dùng cho:

```text
"Đổi submit button thì test nào bị ảnh hưởng?"
```

## Git History

Dùng cho:

```text
"Tại sao locator này được viết như vậy?"
```

---

# 27. Agent tools

AI agent nên có tool rõ ràng:

```text
search_code
read_file
find_symbol
find_usages
list_directory
run_test
run_typecheck
run_lint
git_diff
git_history
playwright_cli
```

Mỗi tool phải có:

```text
input schema
output schema
scope
permission
failure behavior
```

Không tạo một tool kiểu:

```text
do_anything()
```

vì AI khó kiểm soát.

---

# 28. Permission model

AI nên có cấp độ:

## READ

Được:

```text
read_file
search_code
find_symbol
find_usages
git_history
```

## WRITE

Được:

```text
edit_existing_file
create_file
```

nhưng chỉ trong scope.

## EXECUTE

Được:

```text
run_test
run_typecheck
run_lint
playwright_cli
```

## RESTRICTED

Cần confirmation:

```text
delete_file
change_package_json
add_dependency
change_playwright_config
change_ci
change_environment
```

---

# 29. Không cho AI tự ý thêm dependency

Nếu AI muốn thêm package:

```text
npm install xxx
```

AI phải dừng và report:

```text
Dependency change requested:

Package:
xxx

Reason:
...

Why existing tools are insufficient:
...

Expected impact:
...
```

Chỉ tiếp tục khi được phép.

---

# 30. Không cho AI tự ý đổi architecture

Ví dụ AI đang refactor POM nhưng muốn thêm:

```text
service layer
repository layer
domain layer
factory layer
```

Không được tự ý thêm.

AI phải report:

```text
Architecture change requested.

Current:
Spec → Page

Proposed:
Spec → Flow → Service → Page

Reason:
...

Affected files:
...

Please approve architecture change.
```

---

# 31. Anti-patterns cần phát hiện

AI phải chủ động tìm:

```text
page.locator trong spec
page.getByRole trong spec
page.getByText trong spec
page.goto trong spec
waitForTimeout
hardcoded URL
duplicate locator
duplicate business action
new PageObject(page) trong spec
JSON access không typed
God BasePage
generic method name
unused helper
unused fixture
test utility nằm trong specs
```

---

# 32. Checklist scan trước khi refactor

AI chạy checklist:

```text
[ ] Đã đọc architecture.
[ ] Đã đọc conventions.
[ ] Đã đọc rules.
[ ] Đã xác định scope.
[ ] Đã inventory file.
[ ] Đã tìm Page Object hiện có.
[ ] Đã tìm Fixture hiện có.
[ ] Đã tìm test data hiện có.
[ ] Đã tìm duplicate implementation.
[ ] Đã xác định behavior cần giữ nguyên.
```

---

# 33. Checklist sau khi refactor

```text
[ ] Spec chỉ mô tả scenario.
[ ] Spec không chứa locator.
[ ] Page Object chứa locator.
[ ] Page Object dùng semantic naming.
[ ] Fixture inject Page Object.
[ ] Test data được type.
[ ] Không có waitForTimeout.
[ ] Không hardcode URL nếu đã có baseURL.
[ ] Không thêm dependency ngoài yêu cầu.
[ ] Không sửa file ngoài scope.
[ ] Test pass.
[ ] Typecheck pass.
[ ] Lint pass.
[ ] Git diff sạch.
```

---

# 34. Prompt chuẩn để giao AI refactor

Có thể dùng prompt này:

```text
You are a code refactoring agent.

IMPORTANT:
You are not allowed to guess.
You must follow the repository architecture and rules exactly.

TASK:
Refactor <TARGET_FILE>.

SCOPE:
Only modify:
- <FILE_1>
- <FILE_2>
- <FILE_3>

DO NOT MODIFY:
- package.json
- playwright.config.ts
- CI
- unrelated files

GOALS:
1. Move raw locators from spec to Page Object.
2. Use existing fixture if available.
3. Use semantic business-action method names.
4. Preserve test behavior.
5. Do not remove assertions.
6. Do not add waitForTimeout.
7. Do not add dependencies.
8. Do not introduce a new architecture pattern.
9. Keep the diff minimal.

PROCESS:
1. Read .ai/project.yaml.
2. Read .ai/architecture.md.
3. Read .ai/rules.md.
4. Read target file.
5. Find related Page Object.
6. Find related Fixture.
7. Find related Test Data.
8. Create a short refactor plan.
9. Modify only required files.
10. Run typecheck.
11. Run the affected Playwright test.
12. Inspect git diff.
13. Report result.

IF UNCERTAIN:
STOP.
Do not guess.
Report the exact ambiguity.

DONE means:
- Test passes.
- Typecheck passes.
- No unrelated changes.
- No behavior change.
- No raw locator in spec.
```

---

# 35. Prompt chuyên dụng cho từng loại task

## Refactor Spec

```text
Refactor this spec to use the existing Page Object.

Rules:
- Do not change test behavior.
- Do not change assertion meaning.
- Do not create a new abstraction unless required.
- Do not add locators to the spec.
- Do not add waitForTimeout.
- Use existing fixture.
- Keep the diff minimal.
```

## Tạo Page Object

```text
Create a Page Object for this page.

Requirements:
- Put all locators in the Page Object.
- Use semantic Playwright locators.
- Expose business actions, not low-level click/fill helpers.
- Keep constructor simple.
- Do not create unrelated helpers.
- Add only actions required by existing tests.
- Do not change existing test behavior.
```

## Tách Component

```text
Extract a reusable UI component.

Only do this if:
- the UI appears in at least two Page Objects;
- behavior is genuinely shared.

Do not create a component for a single-use element.
```

---

# 36. Nguyên tắc "Minimal Diff"

AI phải ưu tiên:

```text
smallest correct change
```

thay vì:

```text
most elegant rewrite
```

Ví dụ:

### Không nên

Một task sửa locator nhưng AI format lại 30 file.

### Nên

Chỉ sửa:

```text
automation-form.page.ts
automation-form.spec.ts
```

---

# 37. Nguyên tắc "One Concern Per Change"

Một commit/task chỉ nên có một mục tiêu.

### Tốt

```text
refactor: move DemoQA form locators to page object
```

### Không tốt

```text
refactor everything
```

Nếu phát hiện issue khác:

```text
Found unrelated issue:
TodoPage has generic click() method.

Action:
Not changed because it is outside current scope.
```

---

# 38. Priority

Ưu tiên refactor theo thứ tự:

## P0 — Architecture breaking

```text
raw locator trong spec
duplicate architecture
fixture không nhất quán
test utility nằm trong specs
```

## P1 — AI readability

```text
semantic naming
typed test data
AI manifest
architecture docs
flow docs
```

## P2 — Maintainability

```text
duplicate helper
BasePage cleanup
component extraction
test-data cleanup
```

## P3 — Optimization

```text
trace/video/screenshot optimization
context indexing
graph optimization
retrieval ranking
```

---

# 39. Roadmap thực hiện

## Phase 1 — Clean Architecture

```text
1. Inventory repository
2. Chuẩn hóa folder
3. Refactor raw locator khỏi spec
4. Chuẩn hóa Page Object
5. Chuẩn hóa Fixture
6. Chuẩn hóa naming
7. Typed test data
8. BaseURL
9. Tách tools khỏi tests
10. Validation
```

## Phase 2 — AI Readable

```text
11. .ai/project.yaml
12. .ai/architecture.md
13. .ai/rules.md
14. .ai/conventions.md
15. Flow documentation
16. Project inventory
```

## Phase 3 — Context Engine

```text
17. Symbol index
18. File index
19. Semantic search
20. Relationship graph
21. Git history retrieval
22. Context ranking
```

## Phase 4 — Agent

```text
23. read_file
24. search_code
25. find_symbol
26. find_usages
27. run_test
28. typecheck
29. lint
30. playwright-cli
31. git diff
32. controlled auto-fix
```

---

# 40. Tiêu chí thành công

Project được coi là "AI-readable" khi AI có thể trả lời chính xác các câu hỏi:

```text
Test nào cover DemoQA form?
```

→ tìm được spec.

```text
Form được thao tác ở đâu?
```

→ tìm được Page Object.

```text
Submit button locator ở đâu?
```

→ tìm đúng locator.

```text
Page Object được inject ở đâu?
```

→ tìm đúng fixture.

```text
Test data của form nằm ở đâu?
```

→ tìm đúng test-data.

```text
Nếu đổi submit button thì test nào affected?
```

→ tìm được relationship.

```text
Tạo test mới theo architecture hiện tại như thế nào?
```

→ đọc `.ai/rules.md` + existing examples.

---

# 41. Mục tiêu cuối cùng

Không chỉ tạo một Playwright framework đẹp.

Mục tiêu là:

```text
                  AI Chat
                     │
                     ↓
              Context Engine
                     │
       ┌─────────────┼─────────────┐
       ↓             ↓             ↓
   Code Index    Project Graph   Rules
       │             │             │
       └─────────────┼─────────────┘
                     ↓
                  AI Agent
                     │
       ┌─────────────┼─────────────┐
       ↓             ↓             ↓
   Read Code    Playwright CLI   Run Test
       │             │             │
       └─────────────┼─────────────┘
                     ↓
                  Project
```

Và relationship trong code:

```text
Requirement
    ↓
Spec
    ↓
Flow
    ↓
Page Object
    ↓
Component
    ↓
Locator
    ↓
Browser
```

---

# 42. Nguyên tắc quan trọng nhất

> **AI càng yếu thì repository càng phải có contract rõ.**

Không kỳ vọng AI tự hiểu:

```text
"có vẻ nên để ở đây"
```

Mà phải nói rõ:

```text
IF file is a spec
THEN it may contain scenario and assertions
BUT it must not contain raw locators
AND it must use fixture-provided Page Objects.
```

Không kỳ vọng AI tự biết:

```text
"method này nên đặt tên thế nào?"
```

Mà phải cho ví dụ:

```text
BAD:
click()
fill()
handle()

GOOD:
submitForm()
fillPersonalInfo()
selectGender()
expectSubmissionSuccess()
```

Không kỳ vọng AI tự biết khi nào dừng.

Phải có:

```text
IF uncertain
THEN do not guess
AND report the ambiguity.
```

---

# 43. Kết luận

Repo hiện tại đã có nền móng tốt cho hướng AI-readable: POM, fixtures, specs, test-data và Playwright CLI/skill. Vấn đề chính là architecture chưa hoàn toàn nhất quán và các rule dành cho AI chưa đủ explicit.

Ưu tiên đầu tiên không phải là xây RAG.

Ưu tiên đầu tiên là:

```text
1. Clean code structure
2. Explicit architecture rules
3. Semantic naming
4. Typed data
5. Stable Page Object / Fixture contract
6. AI project manifest
7. Deterministic refactor workflow
8. Validation + minimal diff
```

Sau khi hoàn thành các bước trên mới xây:

```text
Symbol Search
    +
Semantic Search
    +
Code Graph
    +
Git History
    ↓
Context Engine
    ↓
AI Agent
```

**Mục tiêu là biến repository thành một "AI-readable codebase", trong đó AI không cần thông minh để đoán architecture — architecture phải đủ rõ để AI chỉ cần làm theo rule.**
