# AI Rules

## Rule 01 — Không sửa ngoài scope

Chỉ được sửa trong phạm vi task.

## Rule 02 — Không thay đổi behavior

Refactor chỉ để cải thiện cấu trúc.

## Rule 03 — Không tạo abstraction nếu chưa cần

Chỉ tạo khi logic xuất hiện 2-3 nơi.

## Rule 04 — Locator thuộc Page Object

Spec không được chứa raw locator.

## Rule 05 — Không dùng hard wait

Dùng web-first assertion thay cho `waitForTimeout`.
