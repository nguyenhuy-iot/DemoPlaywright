# BD & DD - Playwright Login Test Project

## 1. Mục đích Tài liệu

Tài liệu này mô tả thiết kế tổng quan và thiết kế chi tiết cho project tự động kiểm thử login bằng Playwright TypeScript.

Trong tài liệu này:

- `BD` được hiểu là `Basic Design`
- `DD` được hiểu là `Detailed Design`

Project hiện tại thực hiện kiểm thử login trên trang `https://www.saucedemo.com` với tập user đã định nghĩa sẵn, chạy lần lượt từng user và hiển thị browser trong quá trình chạy.

## 2. Basic Design (BD)

### 2.1. Mục tiêu Project

Mục tiêu của project là tự động hóa việc kiểm tra chức năng login của hệ thống SauceDemo bằng Playwright, đảm bảo:

- Có thể chạy nhiều kịch bản login khác nhau trong cùng một bài test
- Phân biệt rõ user login thành công và user login thất bại
- Ghi nhận kết quả theo từng user
- Tổng hợp số lượng `success` và `fail`
- Dễ mở rộng danh sách user và logic test trong tương lai

### 2.2. Phạm vi

Phạm vi hiện tại bao gồm:

- Truy cập trang login của SauceDemo
- Nhập username và password
- Click nút login
- Xác định kết quả login thành công hoặc thất bại
- Ghi log thời gian thực thi cho từng user
- Tổng hợp kết quả sau khi chạy hết danh sách user

Ngoài phạm vi:

- Kiểm tra chức năng sau login như add to cart, checkout
- Kiểm tra database, API backend, hoặc hiệu năng hệ thống
- Kiểm tra đa trình duyệt

### 2.3. Yêu cầu Cao cấp

- Sử dụng `Playwright Test Runner`
- Viết bằng `TypeScript`
- Áp dụng cấu trúc tách lớp để tái sử dụng
- Test chạy lần lượt từng user
- Browser phải được hiển thị trong quá trình chạy
- Mỗi user sử dụng `browser context` riêng để đảm bảo isolation
- Có `try/catch` cho từng lần login
- Không dùng hard wait

### 2.4. Tổng quan Kiến trúc

Project được tách thành 4 lớp chính:

1. `data`
   Chứa dữ liệu đầu vào cho test.

2. `pages`
   Chứa Page Object Model để tương tác với giao diện.

3. `utils`
   Chứa các hàm helper dùng chung như tổng hợp kết quả và format thời gian.

4. `tests`
   Chứa test case, điều phối luồng chạy, assert kết quả và in log.

### 2.5. Cấu trúc Thư mục

```text
playwright-login-test/
|- tests/
|  \- login.spec.ts
|- pages/
|  \- login.page.ts
|- data/
|  \- users.ts
|- utils/
|  \- helper.ts
|- playwright.config.ts
|- tsconfig.json
|- package.json
\- BD_DD.md
```

### 2.6. Luồng Thực thi Chính

```text
Start test
-> Launch 1 browser instance
-> Loop through users sequentially
-> Create new context for current user
-> Open login page
-> Submit credentials
-> Wait for success or fail signal
-> Update summary counters
-> Log result and duration
-> Close current context
```
