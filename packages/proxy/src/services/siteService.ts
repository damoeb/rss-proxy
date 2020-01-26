import * as request from 'request';
import {GetResponse} from './feedService';
import {JSDOM} from 'jsdom';
import {response} from 'express';

export interface SiteMeta {
  language: string
  favicon: string
  date: string
  author: string
  title: string
  copyright: string
}

export const siteService = new class SiteService {
  proxy(url: string): Promise<SiteMeta> {
    return this.download(url).then(response => {
      const doc = this.toDom(response.body);

      return this.getMeta(doc);
    });
  }

  getMeta(doc: Document): SiteMeta {

    return {
      language: this.el(doc.querySelector('html')).getAttribute('lang'),
      favicon: this.getFavIcon(doc),
      date: this.getMetatag(doc, 'date'),
      author: this.getMetatag(doc, 'author'),
      title: this.getMetatag(doc, 'title'),
      copyright: this.getMetatag(doc, 'dcterms.rightsHolder')
        || this.getMetatag(doc, 'dcterms.rights')
        || this.getMetatag(doc, 'copyright'),
    }
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

  public download(url: string): Promise<GetResponse> {
    return new Promise<GetResponse>((resolve, reject) => {
      const options = {method:'GET', url, headers: {"content-type": "text/plain"}};
      request(options, (error, serverResponse, html) => {
        if (!error && serverResponse && serverResponse.statusCode === 200) {
          resolve({body: html, contentType: serverResponse.headers['content-type']});
        } else {
          reject(error);
        }
      });
    });
  }

  toDom(html: string): Document {
    return new JSDOM(html).window.document;
  }
};
