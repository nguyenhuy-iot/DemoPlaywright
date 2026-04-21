export interface LoginSummary {
  success: number;
  fail: number;
}

export const createSummary = (): LoginSummary => ({
  success: 0,
  fail: 0,
});

export const incrementSummary = (summary: LoginSummary, outcome: keyof LoginSummary): void => {
  summary[outcome] += 1;
};

export const getDurationMs = (startTime: number): number => Date.now() - startTime;

export const formatDuration = (durationMs: number): string => `${durationMs} ms`;

export const toErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
};
