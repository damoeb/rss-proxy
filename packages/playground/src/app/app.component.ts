import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FeedService} from './services/feed.service';
import {Article, ArticleRule, OutputType, ContentResolutionType, SourceType, FeedParserOptions} from '../../../core/src';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  html = '';
  feedData = '';
  rules: Array<ArticleRule>;
  currentRule: ArticleRule;
  url: string;
  outputs = [OutputType.ATOM, OutputType.RSS, OutputType.JSON];
  sources = [SourceType.STATIC, SourceType.WITH_SCRIPTS];
  pageResolutions = [ContentResolutionType.STATIC, ContentResolutionType.DEEP];
  showOptions = false;
  showMarkup = false;
  showConsole = false;
  showFeed = true;

  options: FeedParserOptions;

  optionsFromParser: Partial<FeedParserOptions> = {};

  logs: string[];
  articles: Article[];

  constructor(private httpClient: HttpClient,
              private feedService: FeedService) {
    this.url = 'https://www.heise.de/';
    this.reset();
  }

  parseHtml() {
    this.feedData = '';

    this.feedService.fromHTML(this.html, this.options)
      .subscribe(result => {
        this.rules = result.rules;
        this.logs = result.logs;
        this.html = result.html;
        this.articles = result.articles;
        this.optionsFromParser = result.options;
      });

    this.applyRule(this.rules[0]);
  }

  private applyRule(rule: ArticleRule) {
    console.log('apply rule', rule);
    this.currentRule = rule;
    this.feedService.applyRule(this.html, rule, this.options).subscribe(articles => {
      this.articles = articles;
    });
  }

  applyRuleFromEvent(event: Event) {
    console.log('apply rule', this.currentRule);
    this.options.useRuleId = this.currentRule.id;
    this.applyRule(this.currentRule);
  }

  parseFromUrl() {
    this.feedService.fromUrl(this.url, this.options)
      .subscribe(response => {
        this.html = response.html;
        this.logs = response.logs;
        this.rules = response.rules;
        this.currentRule = response.rules[0];
        this.feedData = response.feed;
        this.articles = response.articles;
        this.optionsFromParser = response.options;
      });
  }

  getArticles(): string {
    return this.articles ? JSON.stringify(this.articles, null, 2) : '';
  }

  getFeedUrl() {
    return this.feedService.getDirectFeedUrl(this.url, this.options);
  }

  reset() {
    this.options = {
      output: OutputType.RSS,
      source: SourceType.STATIC,
      useRuleId: null,
      preferExistingFeed: false,
      contentResolution: ContentResolutionType.STATIC,
    };
    this.optionsFromParser = {};
  }
}
