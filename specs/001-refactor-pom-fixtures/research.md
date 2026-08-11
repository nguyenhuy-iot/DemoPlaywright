# Research: Refactor POM & Fixtures

## Technical Decisions

### Decision 1: Project Structure Alignment

**Decision**: Migrate all tests from the root `tests/` directory to the sub-structure defined in the Constitution (Section V).
**Rationale**: Consistency with the project's core principles and improved organization.
**Alternatives considered**: Keeping them in the root `tests/` but this would violate the Constitution's directory structure requirement.

### Decision 2: Page Object Base Class

**Decision**: Implement a `BasePage` in `tests/pages/base.page.ts` to encapsulate common Playwright actions.
**Rationale**: Reduces code duplication across individual Page Objects (e.g., `navigateTo`, `waitForElement`).
**Alternatives considered**: Writing raw `page` commands in every POM, but this is less maintainable.

### Decision 3: Custom Fixture Implementation

**Decision**: Use `test.extend` in `tests/fixtures/base.fixture.ts` to initialize all Page Objects.
**Rationale**: Mandatory per Constitution Principle I. It ensures the `page` object is correctly passed and lifecycle is managed.
**Alternatives considered**: Static helper classes, but they don't integrate with Playwright's fixture system as cleanly.

### Decision 4: Test Data Separation

**Decision**: Store all hardcoded test strings (usernames, addresses) in `tests/test-data/users.json`.
**Rationale**: Mandatory per Constitution Principle III. Makes tests data-driven and easier to update.
**Alternatives considered**: `.env` files (better for secrets) or `faker` (better for unique data), but JSON is best for static known test users.

## Best Practices Resolution

| Unknown/Task              | Finding                                                                                                                                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POM Actions vs Assertions | POM classes should only contain methods that perform actions or check for visibility. Assertions like `expect(header).toBeVisible()` should live in the `.spec.ts` files to keep the intent clear. |
| Fixture Cleanup           | Use `await use(pageObject)` followed by cleanup logic in the fixture definition to ensure proper teardown after each test.                                                                         |
| Parallel Workers          | Use `npx playwright test --workers=4` to verify isolation as required by SC-004.                                                                                                                   |
