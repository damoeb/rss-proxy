import {Response} from 'express';
import {isNumber} from 'lodash';
import {ErrorsResponse} from './app';

export class HttpUtil {
  handlePromise(promise: Promise<any>, response: Response) {
    response.header('Content-Type', 'application/json');
    promise
      .then((articleResponse) => {
        response.send(articleResponse);
      })
      .catch((err) => {
        response.send({error: err.toString()});
      });
  }

  handleHttpErrors(error: string, statusCode: number, callback: (err: ErrorsResponse) => void): void {
    if (error) {
      callback({errors: [{message: `Sorry, cannot load site.`, code: 0}]});
    } else {
      callback({errors: [{message: `Sorry, this site returned a bad http status-code ${statusCode}`, code: 0}]});
    }
  }

  number(val: string): number {
    if (isNumber(val)) {
      return parseInt(val);
    }
    return undefined;
  }

  extractDomain(url: string) {
    const domainRegex = /:\/\/(.[^/]+)/;
    return url.match(domainRegex)[1];
  }
}

export default new HttpUtil();
