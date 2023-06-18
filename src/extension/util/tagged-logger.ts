import { NodeCGServer } from './nodecg';

type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'replicants';

export class TaggedLogger {
  tag: string;
  nodecg: NodeCGServer;

  constructor(tag: string, nodecg: NodeCGServer) {
    this.tag = tag;
    this.nodecg = nodecg;
  }

  log(level: LogLevel, ...msg: Array<any>) {
    this.nodecg.log[level](`[${this.tag}]`, ...msg);
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
