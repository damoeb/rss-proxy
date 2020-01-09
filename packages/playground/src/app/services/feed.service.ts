import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Article, ArticleRule, FeedParser, FeedParserOptions, FeedParserResult, LogCollector} from '../../../../core/src';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  private offline = false;

  constructor(private httpClient: HttpClient) { }

  fromHTML(html: string, options: FeedParserOptions): Observable<FeedParserResult> {
    const domParser = new DOMParser();
    const htmlDoc = domParser.parseFromString(html, 'text/html');

    const logCollector = new LogCollector();
    const feedParser = new FeedParser(htmlDoc, options, logCollector);

    const result: FeedParserResult = {
      logs: logCollector.logs(),
      usesExistingFeed: false,
      options,
      rules: feedParser.getArticleRules(),
      articles: feedParser.getArticles(),
      html
    };
    return of(result);
  }

  applyRule(html: string, rule: ArticleRule, options: FeedParserOptions): Observable<Article[]> {
    const logCollector = new LogCollector();

    const htmlDoc = new DOMParser().parseFromString(html, 'text/html');

    const feedParser = new FeedParser(htmlDoc, options, logCollector);

    return of(feedParser.getArticlesByRule(rule));
  }

  // proxy(url: string) {
  //   const headers = new HttpHeaders({
  //     Accept: 'text/html'
  //   });
  //
  //   return this.httpClient.get(`http://localhost:3000/api/proxy?url=${encodeURI(url)}`, { headers, responseType: 'text' });
  // }

  getDirectFeedUrl(url: string, options: FeedParserOptions): string {
    return `${environment.apiBase}api/feed?url=${encodeURIComponent(url)}&options=${JSON.stringify(options)}`;
  }

  fromUrl(url: string, options: FeedParserOptions): Observable<FeedParserResult> {
    console.log(options);
    return this.httpClient.get(`${environment.apiBase}api/feed/live?url=${
      encodeURIComponent(url)
    }&options=${JSON.stringify(options)}`) as Observable<FeedParserResult>;
  }
}
