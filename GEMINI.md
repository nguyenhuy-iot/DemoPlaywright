# Project Conventions & Workflows

- Test Artifacts: The `screenshots/` directory is used for generated test artifacts and must NOT be committed to the repository. It is ignored in `.gitignore`.
- Code Modification Standard: After any code modification, you MUST run TypeScript checks (`npx tsc --noEmit`), linting (`npx eslint .`), and formatting (`npx prettier --check .`) to ensure structural and stylistic compliance.
- Implementation Planning: Before making any code changes, you MUST create a `plan.md` file outlining the steps. As you work, you must update this file to track progress (e.g., ticking off completed tasks).
