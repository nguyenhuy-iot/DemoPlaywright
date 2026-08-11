import { Page } from '@playwright/test';
import * as path from 'path';

export class EvidenceRecorder {
  private inputIndex = 0;
  private outputIndex = 0;

  constructor(
    private readonly page: Page,
    private readonly outputDir: string
  ) {}

  async step(): Promise<void> {
    this.inputIndex++;
    await this.capture('input', this.inputIndex);
  }

  async expect(): Promise<void> {
    this.outputIndex++;
    await this.capture('output', this.outputIndex);
  }

  private async capture(prefix: 'input' | 'output', index: number): Promise<void> {
    const number = String(index).padStart(2, '0');
    const fileName = `${prefix}_${number}.png`;

    await this.page.screenshot({
      path: path.join(this.outputDir, fileName),
      fullPage: true,
    });
  }
}
