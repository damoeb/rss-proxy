import request from 'request';
import {JSDOM} from 'jsdom';
import createDOMPurify from 'dompurify';

import {GetResponse} from './feedService';
import {config} from '../config';

export interface SiteMeta {
  language: string
  favicon: string
  date: Date
  author: string
  title: string
  copyright: string
}

export const siteService = new class SiteService {
  getMeta(doc: Document): SiteMeta {

    return {
      language: this.el(doc.querySelector('html')).getAttribute('lang'),
      favicon: this.getFavIcon(doc),
      date: new Date(this.getMetatag(doc, 'date')),
      author: this.getMetatag(doc, 'author'),
      title: this.getMetatag(doc, 'title'),
      copyright: this.getMetatag(doc, 'dcterms.rightsHolder')
        || this.getMetatag(doc, 'dcterms.rights')
        || this.getMetatag(doc, 'copyright'),
    };
  }

  public download(url: string, renderJavaScript: boolean = false, timeoutSec: number = 10): Promise<GetResponse> {
    let source = url;
    const timeoutSecWithBounds = Math.min(Math.max(timeoutSec + 2, 0), 30);
    if (config.enableJavaScript && renderJavaScript) {
      source = `http://localhost:${config.port}/api/dynamic?url=${url}&timeout=${timeoutSecWithBounds}`;
    }
    return this.downloadStatic(source, timeoutSecWithBounds + 2);
  }

  private downloadStatic(url: string, timeoutSec: number): Promise<GetResponse> {
    return new Promise<GetResponse>((resolve, reject) => {
      const options = {
        method: 'GET', url, headers: {
          'Accepts': 'text/html',
          'User-Agent': config.userAgent
        }
      };
      // todo mag add timeout
      request(options, (error, serverResponse, html) => {
        if (!error && serverResponse && serverResponse.statusCode === 200) {
          resolve({
            body: html,
            type: 'GetResponse',
            contentType: serverResponse.headers['content-type']
          },);
        } else {
          reject({message: `Unable to download ${url}, cause ${error}`});
        }
      });
    });
  }

  public toDom(html: string): Document {
    const {window} = new JSDOM('');
    const DOMPurify = createDOMPurify(window);

    const clean = DOMPurify.sanitize(html, {
      WHOLE_DOCUMENT: true,
      FORBID_TAGS: ['style', 'script'],
      ADD_TAGS: ['meta', 'html', 'link'],
      ADD_ATTR: ['lang', 'content', 'name', 'type', 'href']
    });
    return new JSDOM(clean).window.document;
  }

  private getMetatag(doc: Document, name: string): string {
    const metaElement = doc.querySelector(`meta[name="${name}"`);
    if (metaElement) {
      return metaElement.getAttribute('content');
    }
  }

  private getFavIcon(doc: Document): string {
    const favIconElement = doc.querySelector('link[rel="shortcut icon"]');

    if (favIconElement) {
      return doc.location.protocol + favIconElement.getAttribute('href');
    }
  }

  private el(element: HTMLHtmlElement): any {
    if (element) {
      return element;
    }
    return {
      getAttribute(qualifiedName: string): string {
        return null;
      }
    };
  }
};
