# Evidence Screenshot Feature — Implementation Guide

## 1. Mục đích

Thêm cơ chế tự động chụp screenshot cho từng **bước thực hiện** và từng **kết quả mong đợi** trong Playwright test.

Feature này phục vụ mục đích tạo **test evidence**.

Có 2 loại screenshot:

- `input_XX.png`: screenshot cho **Các bước thực hiện**.
- `output_XX.png`: screenshot cho **Kết quả mong đợi**.

> **QUAN TRỌNG:** `input` và `output` là tên của **evidence**, không phải input/output data của function.

---

# 2. Requirement bắt buộc

## 2.1. Screenshot cho bước thực hiện

Test author gọi:

```ts
await evidence.step();
```

**ngay sau khi hoàn thành một bước thực hiện trong test case.**

Mỗi lần gọi tạo một file:

```text
input_01.png
input_02.png
input_03.png
...
```

Ví dụ:

```ts
await page.goto('/login');
await evidence.step();

await page.getByLabel('Username').fill('admin');
await evidence.step();

await page.getByLabel('Password').fill('123456');
await evidence.step();
```

Kết quả:

```text
input_01.png
input_02.png
input_03.png
```

### Quy tắc

> Có bao nhiêu lần gọi `evidence.step()` thì có bấy nhiêu `input_XX.png`.

---

# 3. Screenshot cho kết quả mong đợi

Test author gọi:

```ts
await evidence.expect();
```

**ngay trước khi thực hiện assertion kiểm tra kết quả mong đợi.**

Mỗi lần gọi tạo một file:

```text
output_01.png
output_02.png
output_03.png
...
```

Ví dụ:

```ts
await evidence.expect();
await expect(page.getByLabel('Username')).toHaveValue('admin');

await evidence.expect();
await expect(page.getByLabel('Password')).toHaveValue('123456');

await evidence.expect();
await expect(page.getByText('Dashboard')).toBeVisible();
```

Kết quả:

```text
output_01.png
output_02.png
output_03.png
```

### Quy tắc

> Có bao nhiêu lần gọi `evidence.expect()` thì có bấy nhiêu `output_XX.png`.

---

# 4. Input và output sử dụng counter độc lập

Đây là requirement bắt buộc.

KHÔNG sử dụng một counter chung cho input và output.

Phải có:

```ts
private inputIndex = 0;
private outputIndex = 0;
```

Ví dụ:

```ts
await evidence.step(); // input_01
await evidence.step(); // input_02
await evidence.step(); // input_03

await evidence.expect(); // output_01
await evidence.expect(); // output_02
```

Kết quả:

```text
input_01.png
input_02.png
input_03.png

output_01.png
output_02.png
```

Không được tạo:

```text
input_01.png
input_02.png
input_03.png

output_04.png
output_05.png
```

---

# 5. Không yêu cầu input và output phải 1-1

Số lượng action và expected result có thể khác nhau.

Ví dụ:

```text
Các bước thực hiện:
1. Open page
2. Enter username
3. Enter password
4. Click Login

Kết quả mong đợi:
1. Username đúng
2. Password đúng
3. Dashboard hiển thị
4. Username trên Dashboard đúng
5. Role hiển thị đúng
```

Automation:

```ts
await page.goto('/login');
await evidence.step();

await page.getByLabel('Username').fill('admin');
await evidence.step();

await page.getByLabel('Password').fill('123456');
await evidence.step();

await page.getByRole('button', { name: 'Login' }).click();
await evidence.step();

await evidence.expect();
await expect(page.getByLabel('Username')).toHaveValue('admin');

await evidence.expect();
await expect(page.getByLabel('Password')).toHaveValue('123456');

await evidence.expect();
await expect(page.getByText('Dashboard')).toBeVisible();

await evidence.expect();
await expect(page.getByText('admin')).toBeVisible();

await evidence.expect();
await expect(page.getByText('Admin')).toBeVisible();
```

Kết quả:

```text
input_01.png
input_02.png
input_03.png
input_04.png

output_01.png
output_02.png
output_03.png
output_04.png
output_05.png
```

Đây là behavior đúng.

---

# 6. Thời điểm chụp screenshot

## 6.1. `evidence.step()`

`evidence.step()` phải chụp screenshot **ngay tại thời điểm function được gọi**.

Test author sẽ đặt function sau action:

```ts
await page.getByLabel('Username').fill('admin');

await evidence.step();
```

Flow:

```text
Action
  ↓
UI thay đổi
  ↓
evidence.step()
  ↓
Screenshot
  ↓
input_XX.png
```

Không tự động chụp trước action.

Không tự động chụp sau một khoảng delay.

Không tự động chụp trước action.

---

# 7. `evidence.expect()`

`evidence.expect()` phải chụp screenshot **trước assertion**.

Ví dụ bắt buộc:

```ts
await evidence.expect();

await expect(page.getByText('Dashboard')).toBeVisible();
```

Flow:

```text
evidence.expect()
       ↓
Screenshot
       ↓
output_XX.png
       ↓
Playwright expect()
       ↓
PASS / FAIL
```

---

# 8. Screenshot output vẫn phải tồn tại khi test fail

Đây là requirement rất quan trọng.

KHÔNG được implementation theo kiểu:

```ts
try {
    await expect(...);
    await screenshot();
} catch {
    // ...
}
```

vì khi assertion fail screenshot sẽ không được tạo.

Requirement là:

```text
evidence.expect()
       ↓
📸 output_XX.png
       ↓
expect()
       ↓
PASS hoặc FAIL
```

Do đó nếu:

```ts
await evidence.expect();

await expect(page.getByText('Dashboard')).toBeVisible();
```

và assertion FAIL thì:

```text
output_XX.png
```

vẫn phải tồn tại.

Screenshot này dùng để xem **trạng thái UI thực tế trước khi assertion được thực hiện**.

---

# 9. API bắt buộc

API public của feature phải đơn giản:

```ts
await evidence.step();
```

và:

```ts
await evidence.expect();
```

Không yêu cầu callback.

Không truyền action vào `step()`.

Không truyền assertion vào `expect()`.

Không dùng:

```ts
await evidence.step(async () => {
    ...
});
```

Không dùng:

```ts
await evidence.expect(async () => {
    ...
});
```

Không dùng:

```ts
await evidence.run({
    input: ...,
    output: ...
});
```

Lý do:

- Test code phải dễ đọc.
- Test case và automation phải có mapping rõ ràng.
- Input và output có counter độc lập.
- Một action không bắt buộc phải có một expected tương ứng.
- Một expected không bắt buộc phải tương ứng trực tiếp với một action.

---

# 10. Ví dụ API đúng

```ts
await page.goto('/login');
await evidence.step();

await page.getByLabel('Username').fill('admin');
await evidence.step();

await page.getByLabel('Password').fill('123456');
await evidence.step();

await page.getByRole('button', { name: 'Login' }).click();
await evidence.step();

await evidence.expect();
await expect(page.getByText('Dashboard')).toBeVisible();

await evidence.expect();
await expect(page.getByText('admin')).toBeVisible();
```

---

# 11. Ví dụ API sai

## Sai 1 — Bọc action vào evidence

Không được:

```ts
await evidence.step(async () => {
  await page.getByLabel('Username').fill('admin');
});
```

---

## Sai 2 — Bọc assertion vào evidence

Không được:

```ts
await evidence.expect(async () => {
  await expect(page.getByText('Dashboard')).toBeVisible();
});
```

---

## Sai 3 — Gộp input và output

Không được:

```ts
await evidence.run({
    input: async () => {
        ...
    },
    output: async () => {
        ...
    }
});
```

---

## Sai 4 — Screenshot sau assertion

Không được:

```ts
await expect(page.getByText('Dashboard')).toBeVisible();

await evidence.expect();
```

Vì requirement là:

```text
output screenshot
        ↓
assertion
```

không phải:

```text
assertion
        ↓
output screenshot
```

---

# 12. Tên file

Input:

```text
input_01.png
input_02.png
input_03.png
```

Output:

```text
output_01.png
output_02.png
output_03.png
```

Sử dụng 2 chữ số.

Ví dụ:

```text
01
02
03
...
09
10
11
...
99
```

Không sử dụng:

```text
input_1.png
input_2.png
output_1.png
```

Không sử dụng timestamp làm tên chính.

Không sử dụng UUID làm tên chính.

---

# 13. Reset counter

Counter phải reset cho mỗi test case.

Ví dụ:

```text
Test Case A

input_01.png
input_02.png
output_01.png
output_02.png
```

Test Case B:

```text
input_01.png
input_02.png
input_03.png

output_01.png
```

KHÔNG được:

```text
Test Case B

input_03.png
input_04.png
input_05.png

output_03.png
```

---

# 14. Thư mục lưu screenshot

Screenshot phải được lưu trong output directory của **test hiện tại**.

Ưu tiên sử dụng Playwright `testInfo.outputPath()` thay vì hard-code path.

Ví dụ concept:

```ts
const outputDir = testInfo.outputPath('screenshots');
```

Mục tiêu:

```text
test-results/
└── <test-case-output>/
    └── screenshots/
        ├── input_01.png
        ├── input_02.png
        ├── output_01.png
        └── output_02.png
```

Không lưu tất cả test vào một folder global như:

```text
screenshots/
    input_01.png
    input_02.png
```

vì các test có thể ghi đè file của nhau.

---

# 15. Kiến trúc đề xuất

Không đưa screenshot logic vào Page Object.

Không thêm:

```ts
await this.page.screenshot(...)
```

vào từng Page Object.

Tạo một class riêng, ví dụ:

```text
tests/
└── fixtures/
    ├── base.fixture.ts
    └── evidence-recorder.ts
```

Tên class:

```ts
EvidenceRecorder;
```

Class chịu trách nhiệm:

- giữ `Page`
- giữ output directory
- quản lý `inputIndex`
- quản lý `outputIndex`
- tạo filename
- chụp screenshot

Test chỉ sử dụng:

```ts
evidence.step();
evidence.expect();
```

---

# 16. Thiết kế class

Implementation tối thiểu nên có dạng:

```ts
export class EvidenceRecorder {
  private inputIndex = 0;
  private outputIndex = 0;

  constructor(
    private readonly page: Page,
    private readonly outputDir: string
  ) {}

  async step(): Promise<void> {
    // tăng inputIndex
    // tạo input_XX.png
    // chụp screenshot
  }

  async expect(): Promise<void> {
    // tăng outputIndex
    // tạo output_XX.png
    // chụp screenshot
  }
}
```

Không thêm abstraction không cần thiết.

---

# 17. Hàm screenshot nội bộ

Nên tránh duplicate:

```ts
async step() {
  await this.page.screenshot(...);
}

async expect() {
  await this.page.screenshot(...);
}
```

Thay vào đó tạo private helper:

```ts
private async capture(
  prefix: 'input' | 'output',
  index: number,
): Promise<void> {
  // tạo filename
  // chụp screenshot
}
```

Ví dụ:

```ts
private async capture(
  prefix: 'input' | 'output',
  index: number,
): Promise<void> {
  const number = String(index).padStart(2, '0');

  await this.page.screenshot({
    path: path.join(
      this.outputDir,
      `${prefix}_${number}.png`,
    ),
    fullPage: true,
  });
}
```

Sau đó:

```ts
async step(): Promise<void> {
  this.inputIndex++;

  await this.capture(
    'input',
    this.inputIndex,
  );
}
```

và:

```ts
async expect(): Promise<void> {
  this.outputIndex++;

  await this.capture(
    'output',
    this.outputIndex,
  );
}
```

---

# 18. Không hard-code test name trong EvidenceRecorder

Không làm:

```ts
const outputDir = 'test-results/demoqa-form/screenshots';
```

EvidenceRecorder không được biết test case cụ thể là gì.

Output directory phải được inject từ fixture.

Mục tiêu:

```text
Fixture
   ↓
EvidenceRecorder
   ↓
Test
```

EvidenceRecorder chỉ cần biết:

```text
Page
Output directory
```

---

# 19. Tích hợp với Playwright fixture

Project hiện tại có custom fixture.

Cần mở rộng fixture để test có thể nhận:

```ts
{
  (page, evidence);
}
```

Ví dụ concept:

```ts
type ProjectFixtures = {
  evidence: EvidenceRecorder;
};
```

Fixture tạo:

```ts
evidence: async ({ page }, use, testInfo) => {
  const outputDir = testInfo.outputPath('screenshots');

  const evidence = new EvidenceRecorder(
    page,
    outputDir,
  );

  await use(evidence);
},
```

Sau đó test sử dụng:

```ts
test(
  'Login successfully',
  async ({ page, evidence }) => {
    ...
  },
);
```

---

# 20. Test hoàn chỉnh mẫu

Ví dụ test:

```ts
import { test, expect } from './fixtures/base.fixture';

test('Login successfully', async ({ page, evidence }) => {
  // Step 1
  await page.goto('/login');
  await evidence.step();

  // Step 2
  await page.getByLabel('Username').fill('admin');
  await evidence.step();

  // Step 3
  await page.getByLabel('Password').fill('123456');
  await evidence.step();

  // Step 4
  await page
    .getByRole('button', {
      name: 'Login',
    })
    .click();
  await evidence.step();

  // Expected 1
  await evidence.expect();
  await expect(page.getByText('Dashboard')).toBeVisible();

  // Expected 2
  await evidence.expect();
  await expect(page.getByText('admin')).toBeVisible();
});
```

Expected files:

```text
screenshots/
├── input_01.png
├── input_02.png
├── input_03.png
├── input_04.png
├── output_01.png
└── output_02.png
```

---

# 21. Test case có action và expected khác số lượng

AI implementation phải test trường hợp này.

Ví dụ:

```ts
await evidence.step();
await evidence.step();
await evidence.step();

await evidence.expect();
await evidence.expect();
```

Expected:

```text
input_01.png
input_02.png
input_03.png

output_01.png
output_02.png
```

Không được đánh số output theo tổng số screenshot.

---

# 22. Test assertion fail

AI implementation bắt buộc phải kiểm thử:

```ts
await evidence.expect();

await expect(page.getByText('Element Does Not Exist')).toBeVisible();
```

Test phải FAIL.

Nhưng file:

```text
output_01.png
```

phải được tạo.

Đây là acceptance criterion bắt buộc.

---

# 23. Test nhiều expected liên tiếp

AI implementation phải hỗ trợ:

```ts
await evidence.expect();
await expect(locator1).toBeVisible();

await evidence.expect();
await expect(locator2).toBeVisible();

await evidence.expect();
await expect(locator3).toHaveText('Success');
```

Expected:

```text
output_01.png
output_02.png
output_03.png
```

Mỗi `evidence.expect()` chỉ tạo **một screenshot**.

---

# 24. Không tự động screenshot sau mỗi Playwright action

Không implement:

```ts
page.on(...)
```

để tự động chụp sau:

```text
click
fill
press
selectOption
goto
```

Lý do:

- Không phải mọi Playwright action đều là một test step.
- Một test step có thể gồm nhiều action.
- Test case cần chủ động xác định điểm evidence.
- Số lượng screenshot phải khớp với số bước thực hiện trong test case.

Ví dụ:

```ts
await page.getByLabel('First Name').fill('John');
await page.getByLabel('Last Name').fill('Doe');
await page.getByLabel('Email').fill('john@example.com');

await evidence.step();
```

Ba Playwright actions trên chỉ tạo:

```text
input_01.png
```

vì chúng thuộc **một bước thực hiện**.

---

# 25. Không tự động screenshot sau mỗi assertion

Không implement global Playwright expect hook để tự động chụp.

Test author phải viết rõ:

```ts
await evidence.expect();
await expect(...);
```

Điều này giúp mapping với test case rõ ràng.

---

## 26. Full page screenshot

Mặc định sử dụng:

```ts
await page.screenshot({
  path,
  fullPage: false, // Mặc định là false
});
```

Test author có thể tùy chọn:

```ts
await evidence.step({ fullPage: true });
```

Class `EvidenceRecorder` sẽ hỗ trợ option này.

---

# 27. Không thêm description vào API ở version đầu

Không cần:

```ts
await evidence.step('Enter username');
```

Không cần:

```ts
await evidence.expect('Username is correct');
```

Không cần:

```ts
await evidence.step({
  name: 'Enter username',
});
```

Tên step đã tồn tại trong test case/test code.

Version đầu chỉ cần:

```ts
await evidence.step();
await evidence.expect();
```

Mục tiêu là giữ API nhỏ nhất có thể.

---

# 28. Error handling

Nếu screenshot thất bại, không được âm thầm bỏ qua lỗi.

Không làm:

```ts
try {
  await page.screenshot(...);
} catch {
  // ignore
}
```

Nếu screenshot không tạo được, nên để test nhận biết lỗi.

Tuy nhiên không được catch assertion của Playwright trong `evidence.expect()` vì `evidence.expect()` **không thực hiện assertion**.

Nó chỉ:

```text
generate filename
+
take screenshot
```

Assertion vẫn do test author thực hiện:

```ts
await evidence.expect();
await expect(...);
```

---

# 29. Trách nhiệm của từng thành phần

## Test case

Chịu trách nhiệm:

- xác định đâu là step.
- gọi `evidence.step()` đúng vị trí.
- xác định đâu là expected.
- gọi `evidence.expect()` đúng vị trí.
- viết assertion.

Ví dụ:

```ts
await action();
await evidence.step();

await evidence.expect();
await expect(...);
```

---

## EvidenceRecorder

Chịu trách nhiệm:

- screenshot.
- filename.
- numbering.
- output directory.
- input counter.
- output counter.

Không chịu trách nhiệm:

- business logic.
- action.
- assertion.
- expected result.
- test case description.

---

## Page Object

Chịu trách nhiệm:

- locator.
- page interaction.
- page-specific behavior.

Không chịu trách nhiệm screenshot evidence.

Không thêm:

```ts
async screenshot() {}
```

vào từng Page Object nếu không có requirement riêng.

---

# 30. Acceptance Criteria

Feature chỉ được coi là hoàn thành khi tất cả điều kiện sau đúng.

### AC-01 — Step screenshot

```ts
await evidence.step();
```

tạo:

```text
input_01.png
```

Lần thứ hai:

```text
input_02.png
```

---

### AC-02 — Expected screenshot

```ts
await evidence.expect();
```

tạo:

```text
output_01.png
```

Lần thứ hai:

```text
output_02.png
```

---

### AC-03 — Counter độc lập

```ts
step();
step();
expect();
step();
expect();
```

phải tạo:

```text
input_01.png
input_02.png
input_03.png

output_01.png
output_02.png
```

---

### AC-04 — Screenshot trước assertion

Code:

```ts
await evidence.expect();
await expect(...);
```

phải chụp screenshot trước khi assertion chạy.

---

### AC-05 — Assertion fail vẫn có output screenshot

Nếu:

```ts
await evidence.expect();
await expect(...).toBeVisible();
```

fail thì:

```text
output_XX.png
```

vẫn phải tồn tại.

---

### AC-06 — Counter reset

Mỗi test case mới phải bắt đầu:

```text
input_01.png
output_01.png
```

---

### AC-07 — Không overwrite

Các test case khác nhau không được ghi đè screenshot của nhau.

---

### AC-08 — Không auto screenshot

Không tự động chụp screenshot sau mỗi Playwright action hoặc assertion.

---

### AC-09 — API đơn giản

Public API chỉ cần:

```ts
evidence.step();
evidence.expect();
```

---

# 31. Checklist cho AI coding agent

Trước khi kết thúc implementation, AI phải tự kiểm tra:

```text
[ ] Có class EvidenceRecorder riêng.
[ ] Có method evidence.step().
[ ] Có method evidence.expect().
[ ] Có inputIndex riêng.
[ ] Có outputIndex riêng.
[ ] input filename là input_XX.png.
[ ] output filename là output_XX.png.
[ ] XX luôn có 2 chữ số.
[ ] Counter reset theo từng test.
[ ] Output directory thuộc test hiện tại.
[ ] step() screenshot ngay khi được gọi.
[ ] expect() screenshot ngay khi được gọi.
[ ] expect() screenshot xảy ra trước Playwright expect().
[ ] Assertion fail vẫn giữ output screenshot.
[ ] Không bọc callback trong step().
[ ] Không bọc callback trong expect().
[ ] Không dùng chung counter.
[ ] Không auto screenshot sau Playwright action.
[ ] Không auto screenshot sau Playwright assertion.
[ ] Không đưa screenshot logic vào Page Object.
[ ] Có test trường hợp số input khác số output.
[ ] Có test assertion fail.
[ ] Có test nhiều expected liên tiếp.
[ ] Existing tests không bị ảnh hưởng.
```

---

# 32. Quy tắc vàng

Nếu AI chỉ nhớ 5 điều thì phải nhớ 5 điều này:

```text
1. evidence.step() = chụp input screenshot.
2. evidence.expect() = chụp output screenshot.
3. input và output có counter riêng.
4. expect() chụp TRƯỚC assertion.
5. Assertion fail vẫn phải có output screenshot.
```

Pattern chuẩn:

```ts
// Action
await doSomething();

// Evidence của action
await evidence.step();

// Evidence của expected result
await evidence.expect();

// Verification
await expect(...);
```

Đây là pattern chuẩn duy nhất cần sử dụng trong test code.
