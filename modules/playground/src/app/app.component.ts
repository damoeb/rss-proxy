import { Component } from '@angular/core';
import {Article, ArticleRule, FeedParser} from '../../../core/src/feed-parser';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  html = '';
  json = '';
  rules: Array<ArticleRule>;
  private feedParser: FeedParser;
  currentRule: ArticleRule;
  articles: Array<Article>;
  url: string;

  constructor(private httpClient: HttpClient) {

  }

  parseHtml() {
    this.json = '';
    this.articles = [];

    const domParser = new DOMParser();
    const htmlDoc = domParser.parseFromString(this.html, 'text/html');

    this.feedParser = new FeedParser(htmlDoc);

    this.rules = this.feedParser.getArticleRules();

    this.applyRule(this.rules[0]);
  }

  applyRule(rule: ArticleRule) {
    console.log('apply rule', rule);
    this.currentRule = rule;
    this.articles = this.feedParser.getArticlesByRule(rule);
    this.json = JSON.stringify(this.articles, null, 2);
  }

  applyRuleFromEvent(event: Event) {
    console.log('apply rule', this.currentRule);
    this.applyRule(this.currentRule);
  }

  parseUrl() {
    const headers = new HttpHeaders({
      Accept: 'text/html'
    });

    this.httpClient.get(`http://localhost:3000/api/proxy?url=${encodeURI(this.url)}`, { headers, responseType: 'text' })
      .subscribe(response => {
        this.html = response;
        this.parseHtml();
      });
  }
}
