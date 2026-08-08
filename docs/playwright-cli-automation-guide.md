# Hướng dẫn Khám phá và Tự động hóa Web bằng Playwright-CLI

Tài liệu này hướng dẫn quy trình khám phá cấu trúc một trang web và tạo bộ test tự động (E2E) dựa trên Accessibility Tree.

## 1. Chuẩn bị môi trường
Do giới hạn bảo mật của PowerShell, **luôn thực thi lệnh qua Command Prompt (CMD)**.

## 2. Quy trình Khám phá (Exploration)

### Bước 1: Mở trang web
Khởi chạy browser để tương tác:
```cmd
npx playwright-cli open <URL> --headed
```

### Bước 2: Phân tích cấu trúc (Snapshot)
Sau khi trang load xong, lấy Snapshot để xem cấu trúc phần tử (Accessibility Tree) và các `ref` tương ứng:
```cmd
npx playwright-cli snapshot
```
*Kết quả sẽ hiển thị cây cấu trúc với các `ref` như `e99`, `e101`,...*

### Bước 3: Tương tác và Cập nhật
Thực hiện các thao tác trên trang bằng `ref` (dùng `&` để chaining lệnh trong CMD):
```cmd
npx playwright-cli fill <ref> "<value>" & npx playwright-cli click <ref>
```
Sau mỗi lần làm thay đổi giao diện (đóng/mở modal, chuyển trang), hãy chụp lại snapshot mới:
```cmd
npx playwright-cli snapshot
```

## 3. Chuyển đổi sang Code Test Playwright
Từ chuỗi hành động và cấu trúc Snapshot đã thu được, chuyển đổi sang Playwright Locator chuẩn trong file `.spec.ts`:

| CLI Interaction | Playwright Locator chuẩn |
| :--- | :--- |
| `fill <ref> "John"` | `page.getByRole('textbox', { name: 'First Name' }).fill('John')` |
| `click <ref>` | `page.getByRole('button', { name: 'Submit' }).click()` |

**Nguyên tắc chuyển đổi:**
- Luôn ưu tiên `getByRole`, `getByPlaceholder`, `getByLabel` thay vì dựa vào các `ref` tạm thời hoặc CSS selectors phức tạp.
- Sử dụng Accessibility Tree từ Snapshot để xác định `role` và `name` chính xác.

## 4. Lưu ý
- Thư mục `.playwright-cli/` chứa các log và snapshot tạm thời đã được cấu hình để **không commit vào Git**.
- Luôn chạy test bằng lệnh chuẩn: `npx playwright test <path_to_spec.ts>`
