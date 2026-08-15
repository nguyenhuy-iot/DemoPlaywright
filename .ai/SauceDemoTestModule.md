````md
# SauceDemo Test Module Implementation

Thêm module test SauceDemo vào `tests/DEMO/saucedemo`.

## Mục tiêu

- Playwright + TypeScript.
- Code đơn giản, dễ đọc.
- Feature/Page là boundary chính.
- Spec nằm cùng thư mục với Page.
- Một Page có thể có nhiều Spec.
- Dùng `beforeEach` để tránh lặp setup/login.
- User test tập trung trong `data/users.ts`.
- Không tạo fixture/framework abstraction mới nếu chưa cần.
- Follow convention hiện tại của repository.

## Structure

```text
tests/
└── DEMO/
    └── saucedemo/
        ├── data/
        │   └── users.ts
        │
        ├── login/
        │   ├── login.page.ts
        │   ├── login.spec.ts
        │   └── login.error.spec.ts
        │
        ├── inventory/
        │   ├── inventory.page.ts
        │   └── inventory.spec.ts
        │
        ├── cart/
        │   ├── cart.page.ts
        │   └── cart.spec.ts
        │
        └── checkout/
            ├── checkout.page.ts
            └── checkout.spec.ts
````

## Phase 1 - Chỉ implement

```text
tests/DEMO/saucedemo/
├── data/
│   └── users.ts
├── login/
│   ├── login.page.ts
│   ├── login.spec.ts
│   └── login.error.spec.ts
└── inventory/
    ├── inventory.page.ts
    └── inventory.spec.ts
```

Chưa cần implement `cart` và `checkout`.

## Test Data

`data/users.ts`:

* `standard_user`
* `locked_out_user`
* `problem_user`
* `performance_glitch_user`

Password:

`secret_sauce`

Không hard-code username/password trong spec.

Ví dụ:

```ts
await loginPage.login(users.standard);
```

## Login Page

`login.page.ts` chứa các UI action liên quan đến login:

* enter username
* enter password
* click login
* `login(user)`
* lấy login error message

Ưu tiên locator ổn định như:

```text
[data-test="username"]
[data-test="password"]
[data-test="login-button"]
[data-test="error"]
```

## Login Tests

`login.spec.ts`:

1. `standard_user` login thành công.
2. `problem_user` login thành công.
3. `performance_glitch_user` login thành công.

`login.error.spec.ts`:

1. `locked_out_user` login thất bại.
2. Verify error message.

Không tạo abstraction riêng nếu không cần thiết.

## Inventory Tests

`inventory.spec.ts` phải dùng `beforeEach` để login trước mỗi test:

```ts
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);

  await page.goto('/');
  await loginPage.login(users.standard);
});
```

Test cơ bản:

1. Inventory page hiển thị đúng.
2. Hiển thị danh sách products.
3. Add một product vào cart.
4. Cart badge hiển thị đúng.

Spec chỉ tập trung vào scenario + assertion, không lặp lại login/locator logic.

## Inventory Page

`inventory.page.ts` chứa các UI action/helper đơn giản:

* lấy product list
* add product vào cart
* lấy cart badge
* inventory title

Không over-engineering.

## Architecture Rules

1. Không thay đổi architecture hiện tại của repository ngoài module SauceDemo.
2. Không tạo global fixture mới.
3. Không tạo service/repository layer.
4. Page Object chỉ chứa UI interaction.
5. Spec chứa test scenario và assertion.
6. Test data nằm trong `data/users.ts`.
7. Ưu tiên `data-test` locator.
8. Mỗi test phải độc lập và có thể chạy riêng.
9. Dùng `beforeEach` cho common setup.
10. Reuse `LoginPage` thay vì duplicate login code.
11. Follow naming/style convention hiện có của project.

## Expected Flow

```text
spec
  ↓
beforeEach
  ↓
LoginPage.login(user)
  ↓
InventoryPage
  ↓
test action
  ↓
assertion
```

## Future Extension

Khi cần mở rộng, giữ nguyên pattern:

```text
cart/
├── cart.page.ts
└── cart.spec.ts

checkout/
├── checkout.page.ts
└── checkout.spec.ts
```

Mục tiêu là module SauceDemo nhỏ, rõ ràng, dễ đọc và dễ mở rộng; không xây dựng test framework riêng cho demo này.

## Final Verification

Sau khi code:

1. Chạy TypeScript/typecheck nếu project có.
2. Chạy lint nếu project có.
3. Chạy toàn bộ SauceDemo tests.
4. Đảm bảo test không phụ thuộc thứ tự chạy.
5. Không làm ảnh hưởng các test/module hiện tại.

```
```
