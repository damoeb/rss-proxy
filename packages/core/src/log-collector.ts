import {Logger} from './feed-parser';

export class LogCollector implements Logger {
  private _logs:string[] = [];

  constructor(private parentLogger: Logger = undefined) {

  }

  error(...params: any[]) {
    if (this.parentLogger) {
      this.parentLogger.error(...params);
    }
    this._logs.push([...params].join(' '));
  }
  log(...params: any[]) {
    if (this.parentLogger) {
      this.parentLogger.log(...params);
    }
    this._logs.push([...params].join(' '));
  }

  logs() {
    return this._logs;
  }
}
