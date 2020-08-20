import {Component} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {FeedService} from '../../services/feed.service';
import {Article, ArticleRule, OutputType, ContentResolutionType, SourceType, FeedParserOptions, FeedUrl} from '../../../../../core/src';
import {build} from '../../../environments/build';
import {isEmpty} from 'lodash';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent {

  html = '';
  feedData = '';
  rules: Array<ArticleRule>;
  currentRule: ArticleRule;
  url: string;
  outputs = [OutputType.ATOM, OutputType.RSS, OutputType.JSON];
  sources = [SourceType.STATIC, SourceType.WITH_SCRIPTS];
  showDebugger = false;
  showMarkup = false;
  showConsole = false;
  showFeed = false;
  showArticles = false;
  hasResults = false;

  options: FeedParserOptions;

  optionsFromParser: Partial<FeedParserOptions> = {};

  logs: string[];
  articles: Article[];
  feeds: FeedUrl[];
  isLoading = false;
  isGenerated = false;
  error: string;
  history: string[];

  constructor(private httpClient: HttpClient,
              private feedService: FeedService) {
    this.reset();
    this.history = this.getHistory();
  }

  parseHtml() {
    this.feedData = '';
    this.showFeed = false;
    this.showArticles = true;

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
    this.feedService.applyRule(this.html, this.url, rule, this.options).subscribe(articles => {
      this.articles = articles;
    });
  }

  applyRuleFromEvent(event: Event) {
    console.log('apply rule', this.currentRule);
    this.options.rule = this.currentRule.id;
    this.applyRule(this.currentRule);
  }

  parseFromUrl() {
    if (isEmpty(this.url)) {
      this.error = '';
      return;
    }

    this.addToHistory(this.url);

    if (!this.url.startsWith('http://') && !this.url.startsWith('https://')) {
      this.url = 'http://' + this.url;
    }

    try {
      // tslint:disable-next-line:no-unused-expression
      new URL(this.url);
    } catch (e) {
      this.error = 'Please enter a valid url';
      return;
    }

    this.reset();
    this.isLoading = true;
    this.feedService.fromUrl(this.url, this.options)
      .subscribe(response => {
        this.hasResults = true;
        this.isLoading = false;
        if (response.message) {
          this.isGenerated = false;

          try {
            const {html, feeds, logs} = (response as any).data;
            if (html) {
              this.showMarkup = true;
              this.feeds = feeds;
              this.html = html;
            }
            if (logs) {
              this.showConsole = true;
              this.logs = [...logs, response.message];
            } else {
              this.error = response.message;
            }
          } catch (e) {
            this.error = response.message;
          }

          console.error('Proxy replies an error.', response.message);
        } else {
          this.isGenerated = true;
          console.log('Proxy replies an generated feed');
          this.rules = response.rules;
          this.currentRule = response.rules[0];
          this.articles = response.articles;

          this.showArticles = true;
          this.showFeed = !this.showDebugger;
          this.showMarkup = this.showDebugger;
          this.showConsole = this.showDebugger;
          this.html = response.html;
          this.feeds = response.feeds;
          this.logs = response.logs;
          this.feedData = response.feed;
          this.optionsFromParser = response.options;

        }
      }, (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.hasResults = true;
        this.error = error.message;
      });
  }

  getArticles(): string {
    return this.articles ? JSON.stringify(this.articles, null, 2) : '';
  }

  getFeedUrl() {
    return this.feedService.getDirectFeedUrl(this.url, this.options);
  }

  getVersions() {
    return build;
  }

  reset() {
    this.options = {
      output: OutputType.ATOM,
      source: SourceType.STATIC,
      rule: 'best',
      content: ContentResolutionType.STATIC,
    };
    this.optionsFromParser = {};
    this.html = '';
    this.error = '';
    this.feeds = [];
    this.logs = [];
    this.feedData = '';
  }

  getBuildDate() {
    const date = new Date(parseInt(this.getVersions().date, 10));
    return `${date.getUTCDate()}-${date.getUTCMonth()}-${date.getUTCFullYear()}`;
  }

  private getHistory(): string[] {
    return JSON.parse(localStorage.getItem('history') || JSON.stringify([]));
  }

  private addToHistory(url: string) {
    let history = this.history.filter(otherUrl => otherUrl !== url);
    history = history.reverse();
    history.push(url);
    history = history.reverse();
    history = history.filter((otherUrl, index) => index < 5);

    this.history = history;

    localStorage.setItem('history', JSON.stringify(history));
  }

  parseFromHistoryUrl(url: string) {
    this.url = url;
    this.parseFromUrl();
  }

  formatScore(score: any) {
    return score.toFixed(2) * 100;
  }
}
