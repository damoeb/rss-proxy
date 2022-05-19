import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {ContentResolution, ItemFilter} from '../components/playground/playground.component';

export interface Article {
  id: string,
  title: string,
  tags: string[],
  content_text: string,
  content_raw: string,
  content_raw_mime: string,
  main_image_url: string,
  url: string,
  author: string,
  enclosures: null,
  date_published: string,
  commentsFeedUrl: string
}

export interface GenericFeedRule {
  id?: number|string;
  linkXPath: string
  extendContext: string
  contextXPath: string
  dateXPath: string,
  feedUrl: string,
  count: number,
  score: number,
  samples: Article[]
}

export interface FeedDetectionOptions {
  harvestUrl: string;
  original: string;
  withJavascript: boolean;
}

export interface NativeFeedRef {
  url: string,
  type: string,
  title: string
}

export interface FeedDetectionResults {
  genericFeedRules: GenericFeedRule[],
  relatedFeeds: [],
  mimeType: string,
  nativeFeeds: NativeFeedRef[],
  body: string,
  failed: boolean,
  errorMessage?: string
}

export interface FeedDetectionResponse {
  options: FeedDetectionOptions,
  results: FeedDetectionResults
}

export type FeedFormat = 'atom' | 'rss' | 'json'

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  constructor(private httpClient: HttpClient) {
  }

  public fromUrl(url: string): Observable<FeedDetectionResponse> {
    const parserUrl = `/api/feeds/discover?homepageUrl=${encodeURIComponent(url)}`
      // + `&prerender=${renderJavaScript}`;
    ;

    return this.httpClient.get(parserUrl, {withCredentials:true}) as Observable<FeedDetectionResponse>;
  }

  transform(url: string, filters: ItemFilter[], contentResolution: ContentResolution, targetFormat: FeedFormat = 'atom') {
    const parserUrl = `/api/feeds/transform?feedUrl=${encodeURIComponent(url)}&targetFormat=${targetFormat}&resolution=${contentResolution}`;

    return this.httpClient.get(parserUrl, {withCredentials:true}) as  Observable<any>;
  }
}
