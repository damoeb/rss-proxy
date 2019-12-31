import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Article, ArticleRule, FeedParser} from '../../../../core/src';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  private useServer = false;

  constructor(private httpClient: HttpClient) { }

  getRulesForHtml(html: string): Observable<ArticleRule[]> {
    if (this.useServer) {
      return this.httpClient.get(`http://localhost:3000/api/feeeds/parse?html=${encodeURI(html)}`) as Observable<ArticleRule[]>;

    } else {
      const domParser = new DOMParser();
      const htmlDoc = domParser.parseFromString(html, 'text/html');

      const feedParser = new FeedParser(htmlDoc);

      return of(feedParser.getArticleRules());
    }
  }

  getArticlesByRule(rule: ArticleRule): Observable<Article[]> {
    return undefined;
  }

  getHtmlForUrl(url: string) {
    const headers = new HttpHeaders({
      Accept: 'text/html'
    });

    return this.httpClient.get(`http://localhost:3000/api/proxy?url=${encodeURI(url)}`, { headers, responseType: 'text' });
  }
}
