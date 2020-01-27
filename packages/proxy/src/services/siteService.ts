import * as request from 'request';
import {GetResponse} from './feedService';
import {JSDOM} from 'jsdom';
import * as Readability from 'mozilla-readability';
import * as createDOMPurify from 'dompurify';
import {config} from '../config';

export interface SiteMeta {
  language: string
  favicon: string
  date: Date
  author: string
  title: string
  copyright: string
}

interface SiteAnalysis {
  readability: Readability.ParseResult,
  meta: SiteMeta
}

export const siteService = new class SiteService {
  analyze(url: string): Promise<SiteAnalysis> {
    return this.download(url).then(response => {
      const doc = this.toDom(response.body);

      return {
        meta: this.getMeta(doc),
        readability: this.getReadability(doc)
      };
    });
  }

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
    const {window} = new JSDOM('');
    const DOMPurify = createDOMPurify(window);

    const clean = DOMPurify.sanitize(html, {WHOLE_DOCUMENT: true,
      FORBID_TAGS: ['style', 'script'],
      ADD_TAGS:['meta', 'html'],
      ADD_ATTR:['lang', 'content', 'name']});
    return new JSDOM(clean).window.document;
  }

  private getReadability(doc: Document): Readability.ParseResult {
    return new Readability(doc, {debug: config.debug}).parse();
  }
};
