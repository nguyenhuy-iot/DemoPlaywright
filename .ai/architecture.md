# Architecture

## Dependency direction

Spec
↓
Flow
↓
Page
↓
Component
↓
Playwright

## Rules

- Spec does not own locators.
- Page owns locators.
- Fixture creates Page Objects.
- Test data is separate from interaction logic.
- Components are reusable UI units.
- Tools are not tests.
