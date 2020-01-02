import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Article, ArticleRule, FeedParser, FeedParserOptions, FeedParserResult} from '../../../../core/src';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  private offline = false;

  constructor(private httpClient: HttpClient) { }

  fromHTML(html: string, options: FeedParserOptions): Observable<FeedParserResult> {
    if (this.offline) {
      const domParser = new DOMParser();
      const htmlDoc = domParser.parseFromString(html, 'text/html');

      const logs: string[] = [];
      const logCollector = {
        log(...params: any[]) { logs.push(['INFO', ...params].join(' ')); },
        error(...params: any[]) { logs.push(['ERROR', ...params].join(' ')); }
      };
      const feedParser = new FeedParser(htmlDoc, options, logCollector);

      const result: FeedParserResult = {
        logs,
        options,
        rules: feedParser.getArticleRules(),
        html
      };
      return of(result);
    } else {
      return this.httpClient.get(`http://localhost:3000/api/parse?html=${encodeURI(html)}`) as Observable<FeedParserResult>;
    }
  }

  applyRule(rule: ArticleRule): Observable<Article[]> {
    return undefined;
  }

  // proxy(url: string) {
  //   const headers = new HttpHeaders({
  //     Accept: 'text/html'
  //   });
  //
  //   return this.httpClient.get(`http://localhost:3000/api/proxy?url=${encodeURI(url)}`, { headers, responseType: 'text' });
  // }

  fromUrl(url: string, options: FeedParserOptions): Observable<FeedParserResult> {
    console.log(options);
    return this.httpClient.get(`http://localhost:3000/api/parse?url=${
      encodeURI(url)
    }&options=${JSON.stringify(options)}`) as Observable<FeedParserResult>;
  }
}
