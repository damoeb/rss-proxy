import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FeedService} from './services/feed.service';
import {Article, ArticleRule} from '../../../core/src';
import {OutputType, ContentResolutionType, SourceType, FeedParserOptions} from '../../../core/src/feed-parser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  html = '';
  json = '';
  rules: Array<ArticleRule>;
  currentRule: ArticleRule;
  articles: Array<Article>;
  url: string;
  outputs = [OutputType.ATOM, OutputType.RSS, OutputType.JSON];
  sources = [SourceType.STATIC, SourceType.WITH_SCRIPTS];
  pageResolutions = [ContentResolutionType.STATIC, ContentResolutionType.DEEP];
  feedUrl: string;

  options: FeedParserOptions = {
    output: OutputType.JSON,
    source: SourceType.STATIC,
    preferExistingFeed: false,
    contentResolution: ContentResolutionType.STATIC,
  };
  logs: string[];

  constructor(private httpClient: HttpClient,
              private feedService: FeedService) {

  }

  parseHtml() {
    this.json = '';
    this.articles = [];

    this.feedService.fromHTML(this.html, this.options)
      .subscribe(result => {
        this.rules = result.rules;
        this.logs = result.logs;
        this.html = result.html;
      });

    this.applyRule(this.rules[0]);
  }

  applyRule(rule: ArticleRule) {
    console.log('apply rule', rule);
    this.currentRule = rule;
    this.feedService.applyRule(rule).subscribe(articles => {
      this.articles = articles;
    });
    this.json = JSON.stringify(this.articles, null, 2);
  }

  applyRuleFromEvent(event: Event) {
    console.log('apply rule', this.currentRule);
    this.applyRule(this.currentRule);
  }

  parseUrl() {
    this.feedService.fromUrl(this.url, this.options)
      .subscribe(response => {
        this.html = response.html;
        this.logs = response.logs;
        this.rules = response.rules;
        this.currentRule = response.rules[0];
        this.json = response.feed;

        // this.parseHtml();
      });
  }

  update() {
    console.log('update');
  }
}
