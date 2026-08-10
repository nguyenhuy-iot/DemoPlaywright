# Implementation Plan: Refactor POM & Fixtures

**Branch**: `001-refactor-pom-fixtures` | **Date**: 2026-08-10 | **Spec**: [specs/001-refactor-pom-fixtures/spec.md](spec.md)

**Input**: Feature specification from `/specs/001-refactor-pom-fixtures/spec.md`

## Summary
The goal is to refactor the current "flat" test script structure into a modern, maintainable Page Object Model (POM) architecture using Playwright Custom Fixtures. This involves migrating all logic to structured classes in `tests/pages/`, initializing them via `tests/fixtures/`, and isolating test data into `tests/test-data/`.

## Technical Context

**Language/Version**: TypeScript / Node.js

**Primary Dependencies**: `@playwright/test` ^1.59.1

**Storage**: Local JSON files for test data (`tests/test-data/users.json`)

**Testing**: Playwright Test Runner

**Target Platform**: Web (Cross-browser)

**Project Type**: E2E Testing Suite

**Performance Goals**: Test execution time parity with the original flat scripts.

**Constraints**: Must adhere to Project Constitution v1.0.0.

**Scale/Scope**: Refactoring of 4 existing test files (`demoqa-form.spec.ts`, `example.spec.ts`, `demo.spec.ts`, `capture-snapshot.spec.ts`).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] POM & Fixtures (Principle I): Plan uses `test.extend` and Page Object classes.
- [x] Locators (Principle II): Will use `getByRole` etc. in POM classes.
- [x] Test Data (Principle III): Data moved to `users.json`.
- [x] Quality (Principle IV): Parallelism and isolation respected.
- [x] Structure (Section V): Directory layout strictly followed.

## Project Structure

### Documentation (this feature)

```text
specs/001-refactor-pom-fixtures/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output
    └── interfaces.md
```

### Source Code (repository root)

```text
tests/
├── fixtures/
│   ├── base.fixture.ts
│   └── index.ts
├── pages/
│   ├── base.page.ts
│   ├── demoqa-form.page.ts
│   ├── playwright-home.page.ts
│   └── todo.page.ts
├── specs/
│   ├── demoqa-form.spec.ts
│   ├── example.spec.ts
│   ├── demo.spec.ts
│   └── capture-snapshot.spec.ts
└── test-data/
    └── users.json
```

**Structure Decision**: Option 1: Single project (DEFAULT). All testing logic is consolidated under the `tests/` directory with a clear separation of concerns (Pages, Fixtures, Specs, Data).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A       | N/A        | N/A                                 |
