import {Logger} from './feed-parser';

export class LogCollector implements Logger {
  private _logs:string[] = [];

  error(...params: any[]) {
    this._logs.push(['Error', ...params].join(' '))
  }
  log(...params: any[]) {
    this._logs.push(['Info', ...params].join(' '))
  }

  logs() {
    return this._logs;
  }
}
