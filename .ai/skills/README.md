# AI Skills Overview

This directory contains specialized AI skills used to streamline test generation and development workflows within this repository.

## Available Skills

### 1. `AI_TEST_GENERATOR_SKILL`
**Purpose:** Generate complete, maintainable Playwright tests using existing repository architecture.

*   **Key Features:**
    *   Enforces the Page Object Model (POM) pattern.
    *   Generates two files: `<feature>.page.ts` (Page Object) and `<feature>.spec.ts` (Spec).
    *   Strictly forbids introducing new architecture, abstractions, or arbitrary `waitForTimeout` calls.
*   **Usage:** Used for implementing new feature tests while adhering to established standards (`tests/DEMO/<feature>/`).

### 2. `AI_QUICK_TEST_GENERATOR_SKILL`
**Purpose:** Generate a single, copy-paste-ready Playwright `.spec.ts` file from a provided `TEST_CASE` and recording output.

*   **Key Features:**
    *   No Page Objects or helpers allowed—uses direct Playwright/fixture interaction.
    *   Mandatory evidence capture using `evidence.step()` and `evidence.expect()`.
    *   Ensures tests remain independent and follow the original test ID and order.
*   **Usage:** Used for rapid test creation where a full Page Object implementation is unnecessary or not required.

---
*Note: Always refer to the individual skill markdown files for detailed implementation rules and "Definition of Done" checklists.*
