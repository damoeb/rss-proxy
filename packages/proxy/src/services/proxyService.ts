import * as http from 'http';
import * as https from 'https';
import {URL} from 'url';

export interface ProxyResponse {
  headers: any
  body: string
}

export const proxyService = new class ProxyService {

  public async getProxiedHtml(url: string): Promise<ProxyResponse> {
    const parsed = new URL(url);

    return new Promise((resolve, reject) => {
      (parsed.protocol.toLowerCase() === 'https:' ? https : http).get(url, (response) => {
        // const contentType = response.headers['content-type'];

        // Any 2xx status code signals a successful response but
        // here we're only checking for 200.
        if (response.statusCode === 301 || response.statusCode === 302) {
          response.resume();
          reject(`Attempts to redirect to ${response.headers.location}`);
        } else if (response.statusCode !== 200) {
          response.resume();
          reject(`Cannot resolve url. Received HttpCode: ${response.statusCode}`);
        } else {
          response.setEncoding('utf8');
        }
        let rawData = '';
        response.on('data', (chunk) => {
          rawData += chunk;
        });
        response.on('end', () => {
          resolve({
            headers: response.headers,
            body: rawData
          });

        });
      }).on('error', (e) => {
        reject(e.message);
      });
    });
  }
};
