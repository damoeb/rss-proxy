import { Component } from '@angular/core';
import {ArticleRule, FeedParser} from "./feed-parser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  html: string = '';
  json: string = '';
  rules: Array<ArticleRule>;
  private feedParser: FeedParser;
  currentRule: ArticleRule;

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
    this.json = JSON.stringify(this.feedParser.getArticle(rule), null, 2);
  }

  applyRuleFromEvent(event: Event) {
    console.log('apply rule', this.currentRule);
    this.applyRule(this.currentRule);
  }
}
