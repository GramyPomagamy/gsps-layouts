import { get as nodecg } from './nodecg';

export class TaggedLogger {
  tag: string;

  constructor(tag: string) {
    this.tag = tag;
  }

  log(level: string, ...msg: Array<any>) {
    (nodecg().log as any)[level](`[${this.tag}]`, ...msg);
  }

  trace(...msg: Array<any>) {
    this.log('trace', ...msg);
  }
  debug(...msg: Array<any>) {
    this.log('debug', ...msg);
  }
  info(...msg: Array<any>) {
    this.log('info', ...msg);
  }
  warn(...msg: Array<any>) {
    this.log('warn', ...msg);
  }
  error(...msg: Array<any>) {
    this.log('error', ...msg);
  }
}
