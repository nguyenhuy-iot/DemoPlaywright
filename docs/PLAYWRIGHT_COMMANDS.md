# Playwright Commands

File nay tong hop cac lenh Playwright pho bien cho du an hien tai.

## 1. Cai dat browser neu chua co

```bash
npx playwright install
```

## 2. Chay tat ca test

```bash
npx playwright test
```

## 3. Chay theo tung browser

### Chromium

```bash
npx playwright test --project=chromium
```

### Firefox

```bash
npx playwright test --project=firefox
```

### WebKit

```bash
npx playwright test --project=webkit
```

## 4. Chay co mo trinh duyet

```bash
npx playwright test --headed
```

## 5. Chay che do debug

```bash
npx playwright test --debug
```

## 6. Chay giao dien UI cua Playwright

```bash
npx playwright test --ui
```

## 7. Chay 1 file test cu the

```bash
npx playwright test tests/DEMO/home/home.spec.ts
```

## 8. Chay 1 test theo ten

```bash
npx playwright test -g "has title"
```

## 9. Chay 1 dong test cu the

```bash
npx playwright test tests/DEMO/home/home.spec.ts:3
```

## 10. Chay test voi so worker cu the

```bash
npx playwright test --workers=1
```

## 11. Chay lai test fail

```bash
npx playwright test --last-failed
```

## 12. Xem HTML report

```bash
npx playwright show-report
```

## 13. Mo trace viewer

```bash
npx playwright show-trace test-results
```

## 14. Chay test va update snapshot

```bash
npx playwright test --update-snapshots
```

## 15. Chay codegen de ghi lai thao tac

```bash
npx playwright codegen
```

## Ghi chu

- Du an hien tai dang cau hinh 3 project: `chromium`, `firefox`, `webkit`.
- Reporter mac dinh trong [playwright.config.ts](./playwright.config.ts) la `html`.
- Test dang nam trong thu muc [tests](./tests).
