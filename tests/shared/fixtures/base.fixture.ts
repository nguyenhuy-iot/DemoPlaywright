import { test as base, expect as baseExpect } from '@playwright/test';
import { EvidenceRecorder } from '../utilities/evidence/evidence-recorder';

// 1. Định nghĩa kiểu dữ liệu cho các custom fixtures
export type ProjectFixtures = {
  evidence: EvidenceRecorder;
};

// 2. Mở rộng class test để tự động inject Page Objects
export const test = base.extend<ProjectFixtures>({
  evidence: async ({ page }, use, testInfo) => {
    const outputDir = testInfo.outputPath('screenshots');
    const evidence = new EvidenceRecorder(page, outputDir);
    await use(evidence);
  },
});

// Re-export expect
export const expect = baseExpect;
