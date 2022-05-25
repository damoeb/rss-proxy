import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ArticleRecovery } from '../components/playground/playground.component';

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

export interface FeedParams {
  filter?: string;
  articleRecovery?: ArticleRecovery;
  targetFormat?: FeedFormat;
}

export interface NativeFeedWithParams extends FeedParams {
  feedUrl: string;
}

export interface GenericFeedWithParams extends GenericFeedRule, FeedParams {
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

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  constructor(private readonly httpClient: HttpClient) {}

  public discover(
    url: string,
    puppeteerScript = '',
    prerender = false,
  ): Observable<FeedDetectionResponse> {
    const parserUrl = `/api/feeds/discover?homepageUrl=${encodeURIComponent(
      url,
    )}&script=${encodeURIComponent(puppeteerScript)}&prerender=${prerender}`;
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
    return `/api/web-to-feed?version=0.1&url=${encodeURIComponent(
      genericRule.harvestUrl,
    )}&linkXPath=${encodeURIComponent(
      genericRule.linkXPath,
    )}&extendContext=${encodeURIComponent(
      genericRule.extendContext,
    )}&contextXPath=${encodeURIComponent(
      genericRule.contextXPath,
    )}&recovery=${encodeURIComponent(
      genericRule.articleRecovery.toUpperCase(),
    )}&filter=${encodeURIComponent(genericRule.filter)}`;
  }

  createFeedUrlForNative(nativeFeed: NativeFeedWithParams): string {
    return `/api/feeds/transform?feedUrl=${encodeURIComponent(
      nativeFeed.feedUrl,
    )}&targetFormat=${
      nativeFeed.targetFormat || 'json'
    }&resolution=${nativeFeed.articleRecovery.toUpperCase()}&recovery=${
      nativeFeed.articleRecovery
    }&filter=${encodeURIComponent(nativeFeed.filter)}`;
  }

  fetchGenericFeed(genericRule: GenericFeedWithParams): Observable<any> {
    // http://localhost:8080/api/web-to-feed?version=0.1&url=&linkXPath=&extendContext=&contextXPath=&filter=
    const parserUrl = this.createFeedUrlForGeneric(genericRule);
    return this.httpClient.get(parserUrl, {
      withCredentials: true,
      responseType: (!genericRule.targetFormat ||
      genericRule.targetFormat === 'json'
        ? 'json'
        : 'text') as any,
    }) as Observable<any>;
  }

  prerender(siteUrl: string, puppeteerScript: string) {
    const url = `/api/public/puppeteer/screenshot?url=${encodeURIComponent(
      siteUrl,
    )}&script=${encodeURIComponent(puppeteerScript)}`;
    return this.httpClient.get(url, {
      withCredentials: true,
      responseType: 'blob',
    }) as Observable<any>;
  }
}
