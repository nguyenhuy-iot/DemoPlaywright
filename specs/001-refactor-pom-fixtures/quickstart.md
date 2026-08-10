# Quickstart: Validating Refactor

## Prerequisites
- Node.js installed
- Dependencies installed (`npm install`)
- Project Constitution v1.0.0 reviewed

## Setup
No special setup required beyond standard installation.

## Running Tests

### 1. Run all refactored tests
```bash
npx playwright test
```

### 2. Verify Parallel Execution (SC-004)
```bash
npx playwright test --workers=4
```

### 3. Verify No `new` keywords in specs (SC-003)
Manually check `tests/specs/` or use grep:
```bash
grep "new " tests/specs/*.spec.ts
```
*Expected: No results for Page Object classes.*

### 4. Verify Directory Structure (SECTION_V)
Ensure the following paths exist:
- `tests/pages/base.page.ts`
- `tests/fixtures/index.ts`
- `tests/test-data/users.json`
- `tests/specs/`

## Expected Outcomes
- All tests pass in the first run.
- Tests pass consistently across multiple workers.
- The HTML report shows screenshots for any (intentional) failures during development.
