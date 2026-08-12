# Plan: Update Evidence Screenshot Feature for Configurable FullPage

## Objective

Update the `EvidenceRecorder` API to allow optional `fullPage` screenshot configuration (defaulting to `false`).

## Tasks

### 1. Update Implementation

- [x] Update `EvidenceRecorder` class in `tests/fixtures/evidence/evidence-recorder.ts` to accept optional `fullPage` parameter in `step()` and `expect()` methods.
- [x] Update `capture` private helper to utilize the `fullPage` option.

### 2. Verification

- [x] Update `tests/specs/evidence.spec.ts` to verify `fullPage: true` works as intended.
- [x] Run tests and verify screenshots (if possible, verify screenshot dimensions or properties).

### 3. Final Review

- [x] Run linting, formatting, and type checks.
