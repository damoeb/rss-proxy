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

};
