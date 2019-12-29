import { Component } from '@angular/core';
import {Article, ArticleRule, FeedParser} from '../../../rss-it-core/src/feed-parser';

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

  constructor() {

  }

  parseHtml() {

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
}
