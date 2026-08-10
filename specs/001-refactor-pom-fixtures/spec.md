# Feature Specification: Refactor POM & Fixtures

**Feature Branch**: `001-refactor-pom-fixtures`

**Created**: 2026-08-10

**Status**: Draft

**Input**: User description: "Tái cấu trúc (Refactor) toàn bộ mã nguồn kiểm thử tự động hiện có để tuân thủ kiến trúc Page Object Model kết hợp Custom Fixtures."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Refactor DemoQA Form Test (Priority: P1)

Là một kỹ sư QA, tôi muốn chuyển đổi bài kiểm tra DemoQA Form sang mô hình POM và sử dụng Fixtures để mã nguồn dễ bảo trì và mở rộng hơn.

**Why this priority**: Đây là bài kiểm tra nghiệp vụ chính hiện có trong dự án, đại diện cho các tương tác form phức tạp.

**Independent Test**: Chạy lệnh `npx playwright test tests/specs/demoqa-form.spec.ts` và đảm bảo test pass với kiến trúc mới.

**Acceptance Scenarios**:

1. **Given** Trang DemoQA Automation Practice Form, **When** Thực hiện điền form thông qua Page Object được inject từ Fixture, **Then** Form được gửi thành công và hiển thị modal xác nhận.

---

### User Story 2 - Refactor Playwright Dev Tests (Priority: P2)

Là một kỹ sư QA, tôi muốn chuyển đổi các bài kiểm tra tại playwright.dev sang mô hình POM để chuẩn hóa toàn bộ dự án.

**Why this priority**: Đảm bảo tính nhất quán cho các bài kiểm tra điều hướng và kiểm tra tiêu chuẩn.

**Independent Test**: Chạy lệnh `npx playwright test tests/specs/example.spec.ts` và đảm bảo các case 'has title' và 'get started link' pass.

**Acceptance Scenarios**:

1. **Given** Trang chủ Playwright, **When** Kiểm tra tiêu đề hoặc điều hướng qua Page Object, **Then** Kết quả trả về chính xác như mong đợi.

---

### User Story 3 - Refactor TodoMVC Test (Priority: P3)

Là một kỹ sư QA, tôi muốn tái cấu trúc bài kiểm tra TodoMVC từ dạng script thuần sang POM.

**Why this priority**: Loại bỏ các script kiểm thử dạng "mì ăn liền" (spaghetti code) và đưa vào cấu trúc quản lý tập trung.

**Independent Test**: Chạy lệnh `npx playwright test tests/specs/demo.spec.ts` và đảm bảo các thao tác thêm/xóa todo vẫn hoạt động đúng.

**Acceptance Scenarios**:

1. **Given** Ứng dụng TodoMVC, **When** Tương tác với danh sách todo qua Page Object, **Then** Các trạng thái ứng dụng được cập nhật và kiểm tra chính xác.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Toàn bộ các trang (DemoQA Form, Playwright Dev, TodoMVC) MUST được đại diện bởi các class Page Object trong thư mục `tests/pages/`.
- **FR-002**: Tất cả Page Objects MUST kế thừa từ một `BasePage` để dùng chung các phương thức cơ bản (navigate, wait).
- **FR-003**: Spec files MUST sử dụng `test` và `expect` được import từ `tests/fixtures/index.ts`.
- **FR-004**: Tuyệt đối MUST NOT sử dụng `new PageObject(page)` bên trong các file `.spec.ts`.
- **FR-005**: Dữ liệu kiểm thử (như thông tin user John Doe) MUST được tách ra file `tests/test-data/users.json`.

### Key Entities *(include if feature involves data)*

- **BasePage**: Class cơ sở chứa đối tượng `page` và các helper methods.
- **DemoQAFormPage**: Page Object quản lý các locator và action cho trang DemoQA.
- **PlaywrightHomePage**: Page Object quản lý trang chủ playwright.dev.
- **TodoPage**: Page Object quản lý ứng dụng TodoMVC.
- **ProjectFixtures**: Định nghĩa các thuộc tính fixture để inject Page Objects vào test.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% các file test hiện có được chuyển đổi sang kiến trúc POM + Fixtures thành công.
- **SC-002**: Thời gian thực thi bộ test không tăng quá 10% so với trước khi refactor.
- **SC-003**: 100% các file spec mới không chứa từ khóa `new` để khởi tạo Page Object.
- **SC-004**: Tất cả các test case đều pass khi chạy song song với 4 workers.

## Assumptions

- Mã nguồn hiện tại trong `tests/*.spec.ts` là cơ sở để trích xuất logic sang POM.
- Môi trường thử nghiệm (DemoQA, Playwright Dev) ổn định trong quá trình refactor.
- Dự án đã cài đặt đầy đủ các dependency cần thiết cho Playwright và TypeScript.
