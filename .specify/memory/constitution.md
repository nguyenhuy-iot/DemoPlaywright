<!--
Sync Impact Report:
- Version change: none -> 1.0.0 (First official release)
- List of modified principles:
  - PRINCIPLE_1: I. Page Object Model (POM) & Custom Fixtures (Architecture)
  - PRINCIPLE_2: II. Tiêu chuẩn viết Code & Locator (Code Standards & Locators)
  - PRINCIPLE_3: III. Quản lý Fixtures & Test Data
  - PRINCIPLE_4: IV. Chất lượng & Báo cáo (Quality & Reporting)
- Added sections:
  - V. Cấu trúc thư mục chuẩn (Standard Directory Structure)
  - VI. Quy trình kiểm tra & Xác thực (Verification Process)
- Removed sections:
  - PRINCIPLE_5: removed
- Templates requiring updates:
  - .specify/templates/plan-template.md: ✅ updated (no manual updates required)
  - .specify/templates/spec-template.md: ✅ updated (no manual updates required)
  - .specify/templates/tasks-template.md: ✅ updated (no manual updates required)
- Follow-up TODOs: None (All placeholders are fully resolved)
-->

# DemoPlaywright Constitution

## Core Principles

### I. Page Object Model (POM) & Custom Fixtures (Architecture)
Bắt buộc áp dụng mô hình Page Object Model (POM) kết hợp với Custom Fixtures của Playwright. Tuyệt đối không khởi tạo Page Object trực tiếp trong file spec (`new LoginPage(page)`), toàn bộ Page Object phải được inject thông qua Custom Fixtures (`test.extend`). Mỗi trang hoặc component độc lập phải có 1 class Page Object riêng nằm trong thư mục `pages/` hoặc `components/`.

### II. Tiêu chuẩn viết Code & Locator (Code Standards & Locators)
Ưu tiên sử dụng User-facing locators của Playwright (`getByRole`, `getByText`, `getByLabel`, `getByTestId`) thay vì XPath hoặc CSS Selector phức tạp. Viết code theo chuẩn TypeScript nghiêm ngặt (Strict TypeScript), khai báo đầy đủ type/interface cho fixture và data test. Tách biệt rõ ràng giữa hành động (actions) và kiểm tra (assertions). Tránh đưa assertion phức tạp vào trong class Page Object ngoại trừ các hàm kiểm tra trạng thái hiển thị cơ bản.

### III. Quản lý Fixtures & Test Data
Tất cả Custom Fixtures phải nằm trong `fixtures/index.ts` hoặc các file fixture chia nhỏ theo domain. Tự động xử lý dọn dẹp dữ liệu (cleanup/teardown) ngay trong fixture lifecycle (dùng `await use(...)`). Dữ liệu test (Test Data) phải tách rời khỏi test script, lưu trữ dưới dạng JSON/ENV hoặc faker generator.

### IV. Chất lượng & Báo cáo (Quality & Reporting)
Mọi test case phải đảm bảo tính độc lập (Isolating tests), chạy song song (parallel execution) không phụ thuộc dữ liệu lẫn nhau. Áp dụng cơ chế auto-retries, chụp ảnh/quay video màn hình khi test thất bại (on-first-retry). Tích hợp HTML Reporter và cấu hình CI/CD sẵn sàng.

## V. Cấu trúc thư mục chuẩn (Standard Directory Structure)
Quy định cấu trúc tổ chức mã nguồn dưới thư mục `tests/`:
```text
tests/
├── fixtures/
│   ├── base.fixture.ts      # Định nghĩa custom test & inject page objects
│   └── index.ts             # Export fixture chung
├── pages/
│   ├── base.page.ts         # Base Page chứa common actions (wait, navigate...)
│   ├── login.page.ts        # Page Object cho trang Login
│   └── dashboard.page.ts    # Page Object cho trang Dashboard
├── specs/
│   ├── auth.spec.ts         # Test suite xác thực
│   └── dashboard.spec.ts    # Test suite dashboard
├── test-data/
│   └── users.json           # Dữ liệu kiểm thử
├── playwright.config.ts     # Cấu hình Playwright
└── package.json             # Cấu hình dự án
```

## VI. Quy trình kiểm tra & Xác thực (Verification Process)
- Mỗi khi có thay đổi mã nguồn, nhà phát triển phải thực hiện kiểm thử tĩnh bằng TypeScript: `npx tsc --noEmit`.
- Sử dụng công cụ linting để đảm bảo chất lượng code và phong cách lập trình thống nhất: `npm run lint`.
- Đảm bảo tính song song và tính độc lập của kiểm thử bằng cách thực thi bộ test với workers: `npx playwright test --workers=4`.

## Governance
Hiến pháp này là bộ nguyên tắc cốt lõi, bắt buộc tuân thủ cho toàn bộ dự án `DemoPlaywright`. Mọi thay đổi hay sửa đổi nội dung nguyên tắc đều phải tuân thủ nghiêm ngặt quy trình tăng phiên bản theo chuẩn Semantic Versioning (SemVer):
- **MAJOR (X.0.0):** Sửa đổi lớn, loại bỏ hoặc tái định nghĩa các nguyên tắc cốt lõi không tương thích ngược.
- **MINOR (0.Y.0):** Sửa bổ sung thêm nguyên tắc mới hoặc nâng cấp hướng dẫn kỹ thuật chi tiết.
- **PATCH (0.0.Z):** Sửa lỗi chính tả, diễn đạt lại câu chữ, hoặc cập nhật định dạng mà không thay đổi bản chất kỹ thuật.

**Version**: 1.0.0 | **Ratified**: 2026-08-10 | **Last Amended**: 2026-08-10
