import * as http from "http";
import * as https from "https";
import {URL} from 'url';
import {JSDOM} from 'jsdom';
import URI from 'urijs';

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
        } else
        if (response.statusCode !== 200) {
          response.resume();
          reject(`Cannot resolve url. Received HttpCode: ${response.statusCode}`);
        } else

          response.setEncoding('utf8');
        let rawData = '';
        response.on('data', (chunk) => {
          rawData += chunk;
        });
        response.on('end', () => {

          const {window} = new JSDOM(rawData, {
            url,
            contentType: 'text/html'
          });
          const base = window.document.createElement('base');
          base.setAttribute('href', `/api/proxy?url=${encodeURIComponent(url)}`)

          const script = window.document.createElement('script');
          script.type = 'text/javascript';

          window.document.getElementsByTagName('head').item(0).appendChild(base)
          Array.from(window.document.querySelectorAll('[href]')).forEach(el => {
            try {
              const absoluteUrl = new URI(el.getAttribute('href')).absoluteTo(url)
              el.setAttribute('href', absoluteUrl.toString())
            } catch (e) {
              // console.error(e);
            }
          });

          const body = window.document.documentElement.innerHTML;

          resolve({
            headers: response.headers,
            body
          });

        });
      }).on('error', (e) => {
        reject(e.message);
      });
    });
  }
};
