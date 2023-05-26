import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {ArticleRecovery} from '../components/playground/playground.component';
import {JsonFeed} from '../components/feed/feed.component';
import {ApiUrls, AppSettingsService} from './app-settings.service';

export interface Article {
  id: string;
  title: string;
  tags: string[];
  content_text: string;
  content_raw: string;
  content_raw_mime: string;
  main_image_url: string;
  url: string;
  author: string;
  enclosures: null;
  date_published: string;
  commentsFeedUrl: string;
}

export interface GenericFeedRule {
  id?: number | string;
  linkXPath: string;
  extendContext: string;
  contextXPath: string;
  dateXPath: string;
  feedUrl: string;
  count: number;
  score: number;
  samples: Article[];
}

export interface FeedReduce {
  limit: number;
  sortByField: string;
  sortAsc: boolean;
  // sliding window
}

export interface FeedWizardParams {
  filter?: string;
  articleRecovery?: ArticleRecovery;
  targetFormat?: FeedFormat;
  reduce?: FeedReduce;
  digest?: boolean;
  prerendered?: boolean;
  puppeteerScript?: string;
}

export interface NativeFeedWithParams extends FeedWizardParams {
  feedUrl: string;
}

export interface GenericFeedWithParams
  extends GenericFeedRule,
    FeedWizardParams {
  harvestUrl: string;
}

export interface FeedDetectionOptions {
  harvestUrl: string;
  original: string;
  withJavascript: boolean;
}

export interface NativeFeedRef {
  url: string;
  type: string;
  title: string;
}

export interface FeedDetectionResults {
  genericFeedRules: GenericFeedRule[];
  relatedFeeds: [];
  mimeType: string;
  nativeFeeds: NativeFeedRef[];
  body: string;
  failed: boolean;
  errorMessage?: string;
  screenshot?: string;
}

export interface FeedDetectionResponse {
  options: FeedDetectionOptions;
  results: FeedDetectionResults;
}

export type FeedFormat = 'atom' | 'rss' | 'json';

export interface PermanentFeed {
  feedUrl: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  private urls: ApiUrls;
  constructor(
    private readonly httpClient: HttpClient,
    settings: AppSettingsService,
  ) {
    settings.waitForInit.then(() => {
      this.urls = settings.get().urls;
    })
  }

  discover(
    url: string,
    puppeteerScript = '',
    prerender = false,
    strictMode = false,
  ): Observable<FeedDetectionResponse> {
    console.log('strictMode', strictMode);
    const parserUrl =
      this.urls.discoverFeeds +
      this.params({
        homepageUrl: url,
        script: puppeteerScript,
        prerender,
        strictMode,
      });
    return this.httpClient.get(parserUrl, {
      withCredentials: true,
    }) as Observable<FeedDetectionResponse>;
  }

  transformNativeFeed(nativeFeed: NativeFeedWithParams): Observable<any> {
    const parserUrl = this.createFeedUrlForNative(nativeFeed);
    return this.httpClient.get(parserUrl, {
      withCredentials: true,
      responseType: (!nativeFeed.targetFormat ||
      nativeFeed.targetFormat === 'json'
        ? 'json'
        : 'text') as any,
    }) as Observable<any>;
  }

  createFeedUrlForGeneric(genericRule: GenericFeedWithParams): string {
    const search = this.params({
      v: 0.1, // version from env
      url: genericRule.harvestUrl,
      link: genericRule.linkXPath,
      context: genericRule.contextXPath,
      date: genericRule.dateXPath,
      x: genericRule.extendContext,
      re: genericRule.articleRecovery,
      q: genericRule.filter,
      out: genericRule.targetFormat,
      pp: genericRule.prerendered,
      ppS: genericRule.puppeteerScript,
    });
    return `${this.urls.webToFeed}${search}`;
  }

  createFeedUrlForNative(nativeFeed: NativeFeedWithParams): string {
    const search = this.params({
      url: nativeFeed.feedUrl,
      re: nativeFeed.articleRecovery,
      q: nativeFeed.filter,
      out: nativeFeed.targetFormat || 'json',
    });

    return `${this.urls.transformFeed}${search}`;
  }

  fetchGenericFeed(genericRule: GenericFeedWithParams): Observable<any> {
    // http://localhost:8080/api/web-to-feed?version=0.1&url=&linkXPath=&extendContext=&contextXPath=&filter=
    const parserUrl = this.createFeedUrlForGeneric(genericRule);
    return this.httpClient.get(parserUrl, {
      responseType: (!genericRule.targetFormat ||
      genericRule.targetFormat === 'json'
        ? 'json'
        : 'text') as any,
    }) as Observable<any>;
  }

  explainFeed(feedUrl: string): Promise<JsonFeed> {
    console.log('explain', feedUrl);
    const explainUrl = `${this.urls.explainFeed}?feedUrl=${encodeURIComponent(
      feedUrl,
    )}`;
    return firstValueFrom(
      this.httpClient.get<JsonFeed>(explainUrl, {
        withCredentials: true,
      }),
    );
  }

  // findRelated(query: string) {
  //   const relatedUrl = `${this.urls}/api/feeds/query?q=${encodeURIComponent(
  //     query,
  //   )}`;
  //   return firstValueFrom(
  //     this.httpClient.get<JsonFeed[]>(relatedUrl, {
  //       withCredentials: true,
  //     }),
  //   );
  // }

  private params(param: { [key: string]: string | number | boolean }) {
    const search = Object.keys(param)
      .filter((k) => !!param[k])
      .map((k) => `${k}=${encodeURIComponent(param[k] ?? '')}`)
      .join('&');
    return '?' + search;
  }

  requestStandaloneFeedUrl(feedUrl: string): Promise<PermanentFeed> {
    return firstValueFrom(
      this.httpClient.get<PermanentFeed>(
        `${this.urls.standaloneFeed}?url=${encodeURIComponent(feedUrl)}`,
        {
          withCredentials: true,
        },
      ),
    );
  }
}
