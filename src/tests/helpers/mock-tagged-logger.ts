import { vi } from "vitest";
import { type TaggedLogger } from "../../extension/util/tagged-logger";

class MockTaggedLogger {
  tag: string;

  constructor(tag: string) {
    this.tag = tag;
  }

  trace(...msg: Array<any>) {
    vi.fn(...msg);
  }

  debug(...msg: Array<any>) {
    vi.fn(...msg);
  }

  info(...msg: Array<any>) {
    vi.fn(...msg);
  }

  warn(...msg: Array<any>) {
    vi.fn(...msg);
  }

  error(...msg: Array<any>) {
    vi.fn(...msg);
  }
}

export const mockLogger = (tag: string) => {
  const logger = new MockTaggedLogger(tag) as unknown as TaggedLogger;
  return logger;
};
