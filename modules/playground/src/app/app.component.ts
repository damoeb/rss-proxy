import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FeedService} from './services/feed.service';
import {Article, ArticleRule} from '../../../core/src';
import {FeedMappingOptions, OutputType, PageResolutionType, SourceType} from '../../../core/src/feed-parser';

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
  pageResolutions = [PageResolutionType.STATIC, PageResolutionType.NESTED];
  feedUrl: string;

  options: FeedMappingOptions = {
    output: OutputType.JSON,
    source: SourceType.STATIC,
    preferExistingFeed: false,
    pageResolution: PageResolutionType.STATIC,
    parser: null
  };

  constructor(private httpClient: HttpClient,
              private feedService: FeedService) {

  }

  parseHtml() {
    this.json = '';
    this.articles = [];

    this.feedService.getRulesForHtml(this.html).subscribe(rules => {
      this.rules = rules;
    });

    this.applyRule(this.rules[0]);
  }

  applyRule(rule: ArticleRule) {
    console.log('apply rule', rule);
    this.currentRule = rule;
    this.feedService.getArticlesByRule(rule).subscribe(articles => {
      this.articles = articles;
    });
    this.json = JSON.stringify(this.articles, null, 2);
  }

  applyRuleFromEvent(event: Event) {
    console.log('apply rule', this.currentRule);
    this.applyRule(this.currentRule);
  }

  parseUrl() {
    this.feedService.getHtmlForUrl(this.url)
      .subscribe(response => {
        this.html = response;
        this.parseHtml();
      });
  }
}
