# Tasks: Refactor POM & Fixtures

**Input**: Design documents from `/specs/001-refactor-pom-fixtures/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2], [US3])

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure alignment

- [ ] T001 Create project sub-directories `tests/pages`, `tests/fixtures`, `tests/specs`, `tests/test-data` per Constitution Section V
- [ ] T002 [P] Verify `package.json` has necessary devDependencies (`@playwright/test`, `typescript`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: Phase 3-5 implementation cannot begin until this phase is complete

- [ ] T003 Create `BasePage` class in `tests/pages/base.page.ts` with `navigateTo` and `waitForElement` methods
- [ ] T004 Create `tests/test-data/users.json` and populate with `validUser` data per `data-model.md`
- [ ] T005 Define `ProjectFixtures` type and `test.extend` in `tests/fixtures/base.fixture.ts`
- [ ] T006 [P] Create `tests/fixtures/index.ts` to export all fixtures

**Checkpoint**: Foundation ready - Page Object implementation and spec migration can now begin

---

## Phase 3: User Story 1 - Refactor DemoQA Form Test (Priority: P1) 🎯 MVP

**Goal**: Convert DemoQA Form test to POM + Fixtures architecture

**Independent Test**: `npx playwright test tests/specs/demoqa-form.spec.ts`

### Implementation for User Story 1

- [ ] T007 [P] [US1] Create `DemoQAFormPage` class in `tests/pages/demoqa-form.page.ts` with required locators and `login` action
- [ ] T008 [US1] Update `tests/fixtures/base.fixture.ts` to inject `demoQAFormPage`
- [ ] T009 [US1] Create `tests/specs/demoqa-form.spec.ts` using `test` from fixtures and `users.json` data
- [ ] T010 [US1] Remove old `tests/demoqa-form.spec.ts` file

**Checkpoint**: User Story 1 (DemoQA) is fully functional and follows POM standards

---

## Phase 4: User Story 2 - Refactor Playwright Dev Tests (Priority: P2)

**Goal**: Convert Playwright Dev tests to POM + Fixtures architecture

**Independent Test**: `npx playwright test tests/specs/example.spec.ts`

### Implementation for User Story 2

- [ ] T011 [P] [US2] Create `PlaywrightHomePage` class in `tests/pages/playwright-home.page.ts` with `clickGetStarted` action
- [ ] T012 [US2] Update `tests/fixtures/base.fixture.ts` to inject `playwrightHomePage`
- [ ] T013 [US2] Create `tests/specs/example.spec.ts` using fixtures and verify title/navigation
- [ ] T014 [US2] Remove old `tests/example.spec.ts` file

**Checkpoint**: User Story 2 (Playwright Dev) is fully functional and follows POM standards

---

## Phase 5: User Story 3 - Refactor TodoMVC Test (Priority: P3)

**Goal**: Convert TodoMVC test to POM + Fixtures architecture

**Independent Test**: `npx playwright test tests/specs/demo.spec.ts`

### Implementation for User Story 3

- [ ] T015 [P] [US3] Create `TodoPage` class in `tests/pages/todo.page.ts` with `addTodo` and `deleteTodo` actions
- [ ] T016 [US3] Update `tests/fixtures/base.fixture.ts` to inject `todoPage`
- [ ] T017 [US3] Create `tests/specs/demo.spec.ts` using fixtures and verify todo operations
- [ ] T018 [US3] Remove old `tests/demo.spec.ts` file

**Checkpoint**: User Story 3 (TodoMVC) is fully functional and follows POM standards

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, cleanup, and documentation

- [ ] T019 [P] Triage `tests/capture-snapshot.spec.ts` and migrate if needed to `tests/specs/`
- [ ] T020 [P] Update `package.json` scripts to point to new `tests/specs/` paths
- [ ] T021 [P] Run static analysis: `npx tsc --noEmit`
- [ ] T022 [P] Run full test suite with parallel workers: `npx playwright test --workers=4`
- [ ] T023 Final code cleanup and removal of any remaining direct Page Object instantiations
- [ ] T024 Validate all success criteria in `quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Setup (Phase 1)**: Initial folder structure.
2. **Foundational (Phase 2)**: Depends on Phase 1. Blocks all story-specific implementation.
3. **User Stories (Phase 3-5)**: All depend on Phase 2 completion. Can be worked on in parallel.
4. **Polish (Phase 6)**: Depends on all user stories being complete.

### Parallel Opportunities

- **Setup tasks** (T001, T002) can run in parallel.
- **Fixture registration** (T006) can run alongside base class creation.
- **Page Object creation** for different stories (T007, T011, T015) can run in parallel.
- **Final verification tasks** (T019-T022) can run in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 & 2 (Foundation).
2. Complete Phase 3 (DemoQA Form).
3. **Validate**: Run `npx playwright test tests/specs/demoqa-form.spec.ts`.

### Incremental Delivery

1. Foundation → Base architecture ready.
2. Add US1 → Complex form support (MVP).
3. Add US2 → Navigation/Static check support.
4. Add US3 → Interactive app support.
5. Polish → Final quality gate.
