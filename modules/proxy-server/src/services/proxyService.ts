import * as request from 'request';
import {Response} from 'request';

export interface ProxyResponse {
  response: Response;
  body: string;
}

export default new class ProxyService {
  proxy(url: string): Promise<ProxyResponse> {
    return new Promise((resolve, reject) => {
      request(url, (error, serverResponse, body) => {
        if (!error && serverResponse && serverResponse.statusCode === 200) {
          resolve(<ProxyResponse> {response: serverResponse, body});
        } else {
          console.error(`proxy error ${url} cause ${error}, ${serverResponse.statusCode}`);
          reject(error);
        }
      });
    });
  }
}
