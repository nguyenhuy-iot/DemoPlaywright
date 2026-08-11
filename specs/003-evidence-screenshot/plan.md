# Plan: Evidence Screenshot Feature

## Objective
Implement an automated evidence screenshot feature in Playwright tests as per the design document `.ai/EVIDENCE SCREENSHOT FEATURE — IMPLEMENTATION GUIDE.md`.

## Tasks

### 1. Research & Analysis
- [x] Inspect `tests/fixtures/base.fixture.ts` to plan `EvidenceRecorder` integration.
- [x] Confirm how to retrieve `testInfo` to correctly isolate screenshot output directories.

### 2. Implementation
- [x] Create `tests/fixtures/evidence/evidence-recorder.ts` with `EvidenceRecorder` class.
- [x] Update `tests/fixtures/base.fixture.ts` to include the `evidence` fixture.

### 3. Verification & Testing
- [x] Create `tests/specs/evidence.spec.ts` to test:
    - [x] Correct file naming (`input_XX.png`, `output_XX.png`).
    - [x] Independent counter behavior.
    - [x] Screenshot captured before assertion.
    - [x] Screenshots created even if assertion fails.
    - [x] Counter reset between tests.
- [x] Verify existing tests still pass.

### 4. Final Review
- [x] Run linting, formatting, and type checks.
- [x] Ensure all acceptance criteria from the implementation guide are met.

