import {Logger} from './feed-parser';

export class LogCollector implements Logger {
  private _logs:string[] = [];

  constructor(private useConsole = false) {

  }

  error(...params: any[]) {
    if (this.useConsole) {
      console.error(...params);
    }
    this._logs.push(['Error', ...params].join(' '))
  }
  log(...params: any[]) {
    if (this.useConsole) {
      console.info(...params);
    }
    this._logs.push(['Info', ...params].join(' '))
  }

  logs() {
    return this._logs;
  }
}
