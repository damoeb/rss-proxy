import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {
  Article,
  ArticleRule,
  ContentType,
  FeedParser,
  FeedParserOptions,
  FeedParserResult,
  LogCollector,
  OutputType
} from '../../../../core/src';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  private defaultOptions: FeedParserOptions = {
    o: OutputType.ATOM,
    c: ContentType.RAW,
    js: false
  };

  constructor(private httpClient: HttpClient) {
  }

  public fromHTML(html: string, options: FeedParserOptions, url: string): Observable<FeedParserResult> {
    const domParser = new DOMParser();
    const htmlDoc = domParser.parseFromString(html, 'text/html');

    const logCollector = new LogCollector(console);
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

  public applyRule(html: string, url: string, rule: ArticleRule, options: FeedParserOptions): Observable<Article[]> {
    const logCollector = new LogCollector();

    const htmlDoc = new DOMParser().parseFromString(html, 'text/html');

    const feedParser = new FeedParser(htmlDoc, url, options, logCollector);

    return of(feedParser.getArticlesByRule(rule));
  }

  public getDirectFeedUrl(url: string, options: FeedParserOptions): string {
    return `/api/feed?url=${encodeURIComponent(url)}`
      + this.feedUrlFragment('pContext', options)
      + this.feedUrlFragment('js', options)
      + this.feedUrlFragment('pLink', options)
      + this.feedUrlFragment('o', options)
      + this.feedUrlFragment('c', options)
      + this.feedUrlFragment('xq', options)
      + this.feedUrlFragment('x', options)
      // + `&js=${renderJavaScript}`;
      ;
  }

  public fromUrl(url: string, options: FeedParserOptions): Observable<FeedParserResult> {
    const parserUrl = `/api/feed/live?url=${encodeURIComponent(url)}`
      + this.feedUrlFragment('pContext', options)
      + this.feedUrlFragment('js', options)
      + this.feedUrlFragment('pLink', options)
      + this.feedUrlFragment('o', options)
      + this.feedUrlFragment('c', options)
      + this.feedUrlFragment('xq', options)
      // + `&js=${renderJavaScript}`;
    ;

    return this.httpClient.get(parserUrl) as Observable<FeedParserResult>;
  }

  private feedUrlFragment(id: 'c' | 'o' | 'xq' | 'pContext' | 'pLink' | 'js' | 'x', options: FeedParserOptions) {

    function prop<T, K extends keyof T>(obj: T, key: K) {
      return obj[key];
    }

    if (prop(this.defaultOptions, id) !== prop(options, id)) {
      return `&${id}=${encodeURIComponent(prop(options, id))}`;
    }
    return '';
  }

  public getDynamicContent(url: string): Observable<string> {
    return this.httpClient.get(`/api/dynamic?url=${url}`, {responseType: 'text'}) as Observable<string>;
  }
}
