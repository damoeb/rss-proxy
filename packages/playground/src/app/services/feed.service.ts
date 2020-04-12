import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Article, ArticleRule, FeedParser, FeedParserOptions, FeedParserResult, LogCollector} from '../../../../core/src';
import {environment} from '../../environments/environment';
import {ContentResolutionType, OutputType, SourceType} from '../../../../core/dist';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  private defaultOptions: FeedParserOptions = {
    output: OutputType.RSS,
    source: SourceType.STATIC,
    content: ContentResolutionType.STATIC
  };

  constructor(private httpClient: HttpClient) { }

  fromHTML(html: string, options: FeedParserOptions): Observable<FeedParserResult> {
    const domParser = new DOMParser();
    const htmlDoc = domParser.parseFromString(html, 'text/html');

    const logCollector = new LogCollector(console);
    const url = 'http://example.com';
    const feedParser = new FeedParser(htmlDoc, url, options, logCollector);

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

  applyRule(html: string, url: string, rule: ArticleRule, options: FeedParserOptions): Observable<Article[]> {
    const logCollector = new LogCollector();

    const htmlDoc = new DOMParser().parseFromString(html, 'text/html');

    const feedParser = new FeedParser(htmlDoc, url, options, logCollector);

    return of(feedParser.getArticlesByRule(rule));
  }

  getDirectFeedUrl(url: string, options: FeedParserOptions): string {
    return `${this.getApiBase()}api/feed?url=${encodeURIComponent(url)}`
      + this.feedUrlFragment('rule', options)
      + this.feedUrlFragment('output', options)
      + this.feedUrlFragment('content', options);
  }

  fromUrl(url: string, options: FeedParserOptions): Observable<FeedParserResult> {
    const parserUrl = `${this.getApiBase()}api/feed/live?url=${encodeURIComponent(url)}`
      + this.feedUrlFragment('rule', options)
      + this.feedUrlFragment('output', options)
      + this.feedUrlFragment('content', options);

    return this.httpClient.get(parserUrl) as Observable<FeedParserResult>;
  }

  private feedUrlFragment(id: 'output'|'content'|'rule', options: FeedParserOptions) {

    function prop<T, K extends keyof T>(obj: T, key: K) {
      return obj[key];
    }

    if (prop(this.defaultOptions, id) !== prop(options, id)) {
      return `&${id}=${encodeURIComponent(prop(options, id))}`;
    }
    return '';
  }

  private getApiBase() {
    return environment.apiBase || location.href;
  }
}
