import { Page } from '@playwright/test';
import * as path from 'path';

export type EvidenceOptions = {
  fullPage?: boolean;
};

export class EvidenceRecorder {
  private inputIndex = 0;
  private outputIndex = 0;

  constructor(
    private readonly page: Page,
    private readonly outputDir: string
  ) {}

  async step(options: EvidenceOptions = {}): Promise<void> {
    this.inputIndex++;
    await this.capture('input', this.inputIndex, options.fullPage ?? false);
  }

  async expect(options: EvidenceOptions = {}): Promise<void> {
    this.outputIndex++;
    await this.capture('output', this.outputIndex, options.fullPage ?? false);
  }

  private async capture(
    prefix: 'input' | 'output',
    index: number,
    fullPage: boolean
  ): Promise<void> {
    const number = String(index).padStart(2, '0');
    const fileName = `${prefix}_${number}.png`;

    await this.page.screenshot({
      path: path.join(this.outputDir, fileName),
      fullPage,
    });
  }
}
