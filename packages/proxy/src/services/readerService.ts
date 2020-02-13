import {compact, uniq} from 'lodash';
import {SiteAnalysis, siteService} from './siteService';

export interface ReaderResponse extends SiteAnalysis {
}

export const readerService = new class ReaderService {
  reader(url: string): Promise<ReaderResponse> {
    return siteService.analyze(url).then(response => {

      if (response.readability) {
        return response;
      }
      return Promise.reject();
    });
  }

  parseArticle(url: string) {
    return this.reader(url).then(result => {
      return {
        language: result.meta.language,
        date: result.meta.date,
        authors: uniq(compact([result.meta.author, result.readability.byline])),
        title: result.readability.title,
        textContent: result.readability.textContent,
        content: result.readability.content,
        // links: result.links,
      };
    })
  }
};
