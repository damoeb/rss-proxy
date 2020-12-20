import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {FeedService} from '../../services/feed.service';
import {Article, ArticleRule, ContentResolutionType, FeedParserOptions, FeedUrl, OutputType, SourceType} from '../../../../../core/src';
import {build} from '../../../environments/build';
import {isEmpty} from 'lodash';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaygroundComponent implements OnInit {
  private iframeLoaded = false;

  constructor(private httpClient: HttpClient,
              private sanitizer: DomSanitizer,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef,
              private feedService: FeedService) {
    this.reset();
    this.history = PlaygroundComponent.getHistory();
  }

  @ViewChild('iframeElement', {static: false}) iframeRef: ElementRef;
  html = '';
  feedData = '';
  rules: Array<ArticleRule>;
  currentRule: ArticleRule;
  url = 'https://www.heise.de';
  showViz = 'viz';
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
  proxyUrl: SafeResourceUrl;
  currentTab: string;

  private static getHistory(): string[] {
    return JSON.parse(localStorage.getItem('history') || JSON.stringify([]));
  }

  public ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.url) {
        this.url = params.url;
        this.parseFromUrlInternal();
      }
    });
  }

  private applyRule(rule: ArticleRule) {
    console.log('apply rule', rule);
    this.currentRule = rule;
    this.highlightRule(rule);
    this.feedService.applyRule(this.html, this.url, rule, this.options).subscribe(articles => {
      this.articles = articles;
    });
  }

  public async parseFromUrl() {
    if (this.isLoading) { return; }
    const queryParams: Params = { url: this.url };

    return this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams,
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
  }

  private parseFromUrlInternal(): void {
    if (isEmpty(this.url)) {
      this.error = '';
      this.changeDetectorRef.detectChanges();
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
      this.changeDetectorRef.detectChanges();
      return;
    }
    this.isLoading = true;
    this.prepareIframe(this.url);
    this.changeDetectorRef.detectChanges();

    this.feedService.fromUrl(this.url, this.options)
      .subscribe(response => {
        this.hasResults = true;
        this.isLoading = false;
        if (response.message) {
          this.isGenerated = false;

          try {
            const {html, feeds, logs} = (response as any).data;
            if (html) {
              this.feeds = feeds;
              this.html = html;
            }
            if (logs) {
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
          this.updateScores();
          this.applyRule(this.rules[0]);
          this.setCurrentTab(this.showViz);
          this.feeds = response.feeds;
          this.feedData = response.feed;
          this.optionsFromParser = response.options;
          this.changeDetectorRef.detectChanges();
        }
      }, (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.hasResults = false;
        this.error = error.message;
        this.changeDetectorRef.detectChanges();
      });
  }

  public getFeedUrl() {
    return this.feedService.getDirectFeedUrl(this.url, this.options);
  }

  getVersions() {
    return build;
  }

  public reset() {
    this.options = {
      output: OutputType.ATOM,
      source: SourceType.STATIC,
      rule: 'best',
      content: ContentResolutionType.STATIC,
    };
    this.optionsFromParser = {};
    this.html = '';
    this.error = '';
    this.hasResults = false;
    this.iframeLoaded = false;
    this.feeds = [];
    this.currentRule = null;
    this.logs = [];
    this.url = null;
    this.rules = null;
    this.proxyUrl = null;
    this.feedData = '';
  }

  public getBuildDate() {
    const date = new Date(parseInt(this.getVersions().date, 10));
    return `${date.getUTCDate()}-${date.getUTCMonth()}-${date.getUTCFullYear()}`;
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

  public parseFromHistoryUrl(url: string) {
    this.url = url;
    return this.parseFromUrl();
  }

  private setCurrentTab(tab: string) {
    this.currentTab = tab;
  }

  public isCurrentRule(rule: ArticleRule): boolean {
    return this.currentRule === rule;
  }

  private prepareIframe(url: string) {
    this.proxyUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`/api/proxy?url=${encodeURIComponent(url)}`);
  }

  private highlightRule(rule: ArticleRule): void {
    const iframeDocument = this.iframeRef.nativeElement.contentDocument;
    const id = 'rss-proxy-style';

    try {
      iframeDocument.getElementById(id).remove();
    } catch (e) {

    }
    const styleNode = iframeDocument.createElement('style');
    styleNode.setAttribute('type', 'text/css');
    styleNode.setAttribute('id', id);
    const code = `${rule.contextPath} {
            border: 2px solid red!important;
            margin-bottom: 5px!important;
            display: block;
          }
          `;

    const firstMatch = iframeDocument.querySelector(rule.contextPath);
    if (firstMatch) {
      firstMatch.scrollIntoView();
    }

    styleNode.appendChild(iframeDocument.createTextNode(code));
    iframeDocument.head.appendChild(styleNode);
  }

  public onIframeLoad(): void {
    if (this.rules) {
      this.updateScores();
    } else {
      this.iframeLoaded = true;
    }
  }
  public updateScores(): void {
    const iframeDocument = this.iframeRef.nativeElement.contentDocument;
    this.rules.forEach(rule => {
      const articles = Array.from(iframeDocument.querySelectorAll(rule.contextPath))
          // remove hidden articles
          .filter((elem: any) => !!(elem.offsetWidth || elem.offsetHeight))
        // remove empty articles
        // .filter((elem: any) => elem.textContent.trim() > 0)
        // .filter((elem: any) => Array.from(elem.querySelectorAll(rule.linkPath)).length > 0);
      ;
      if (articles.length === 0) {
        rule.score -= 20;
      }
    });
    this.changeDetectorRef.detectChanges();
  }
}
