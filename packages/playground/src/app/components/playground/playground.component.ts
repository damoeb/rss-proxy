import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {isEmpty} from 'lodash';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {FeedService} from '../../services/feed.service';
import {Article, ArticleRule, FeedParser, FeedParserOptions, FeedUrl, OutputType} from '../../../../../core/src';
import {build} from '../../../environments/build';

interface ArticleCandidate {
  elem: HTMLElement;
  index: number;
  qualified: boolean;
}

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaygroundComponent implements OnInit {

  @ViewChild('iframeElement', {static: false}) iframeRef: ElementRef;
  html = '';
  feedData = '';
  rules: Array<ArticleRule>;
  currentRule: ArticleRule;
  url = 'https://www.heise.de';
  showViz = 'viz';
  hasResults = false;
  iframeLoaded = false;
  options: FeedParserOptions = {} as FeedParserOptions;
  logs: string[];
  articles: Article[];
  feeds: FeedUrl[];
  isLoading = false;
  isGenerated = false;
  error: string;
  history: string[];
  proxyUrl: SafeResourceUrl;
  currentTab: string;
  excludeItemsThatContain = false;
  excludeItemsThatContainTexts = 'Newsletter, Advertisement';

  constructor(private httpClient: HttpClient,
              private sanitizer: DomSanitizer,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef,
              private feedService: FeedService) {
    this.resetAll();
    this.history = PlaygroundComponent.getHistory();
  }

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

  public applyRule(rule: ArticleRule) {
    console.log('apply rule', rule);
    this.currentRule = rule;
    this.options.pContext = rule.contextXPath;
    this.options.pLink = rule.linkXPath;
    this.feedService.applyRule(this.html, this.url, rule, this.options).subscribe(articles => {
      this.articles = articles;
    });
    this.highlightRule(rule);
    this.changeDetectorRef.detectChanges();
  }

  public async parseFromUrl() {
    if (this.isLoading) {
      return;
    }
    const queryParams: Params = {url: this.url};

    return this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams,
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
  }

  public getFeedUrl() {
    return this.feedService.getDirectFeedUrl(this.url, this.options);
  }

  getVersions() {
    return build;
  }

  public resetAll() {
    this.options = {
      o: OutputType.ATOM,
      xq: this.excludeItemsThatContainTexts,
    };
    this.html = '';
    this.error = '';
    this.hasResults = false;
    this.iframeLoaded = false;
    this.feeds = [];
    this.currentRule = null;
    this.logs = [];
    // this.url = null;
    this.rules = null;
    this.proxyUrl = null;
    this.feedData = '';
  }

  public getBuildDate() {
    const date = new Date(parseInt(this.getVersions().date, 10));
    return `${date.getUTCDate()}-${date.getUTCMonth()}-${date.getUTCFullYear()}`;
  }

  public parseFromHistoryUrl(url: string) {
    this.url = url;
    return this.parseFromUrl();
  }

  public isCurrentRule(rule: ArticleRule): boolean {
    return this.currentRule === rule;
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
      const articles = this.evaluateXPathInIframe(rule.contextXPath, iframeDocument)
          // remove hidden articles
          .filter((elem: any) => !!(elem.offsetWidth || elem.offsetHeight))
        // remove empty articles
        // .filter((elem: any) => elem.textContent.trim() > 0)
        // .filter((elem: any) => Array.from(elem.querySelectorAll(rule.linkPath)).length > 0);
      ;
      if (articles.length === 0) {
        rule.score -= 20;
        // rule.hidden = true;
      }
    });
    this.changeDetectorRef.detectChanges();
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

    this.updateParserOptions();

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

          console.error('Proxy replied an error.', response.message);
          // tslint:disable-next-line:max-line-length
          this.error = `Looks like this site does not contain any feed data.`;
        } else {
          this.isGenerated = true;
          console.log('Proxy replies an generated feed');
          this.rules = response.rules;
          setTimeout(() => {
            this.applyRule(this.rules[0]);
          }, 1000);
          this.setCurrentTab(this.showViz);
          this.feeds = response.feeds;
          this.feedData = response.feed;
          const optionsFromParser = response.options;
          this.options.c = optionsFromParser.c;
          this.options.o = optionsFromParser.o;
          // todo mag add fallback option
          this.changeDetectorRef.detectChanges();
        }
      }, (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.hasResults = false;
        this.error = error.message;
        this.changeDetectorRef.detectChanges();
      });
  }

  private addToHistory(url: string) {
    let history = this.history.filter(otherUrl => otherUrl !== url);
    history = history.reverse();
    history.push(url);
    history = history.reverse();
    history = history.filter((otherUrl, index) => index < 15);

    this.history = history;

    localStorage.setItem('history', JSON.stringify(history));
  }

  private setCurrentTab(tab: string) {
    this.currentTab = tab;
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
    const allMatches: HTMLElement[] = this.evaluateXPathInIframe(rule.contextXPath, iframeDocument);

    const qualifiedAsArticle = (elem: HTMLElement): boolean => {
      // todo apply filters
      return FeedParser.qualifiesAsArticle(elem, rule, iframeDocument);
    };
    const matchingIndexes = allMatches
      .map(elem => {
        const index = Array.from(elem.parentElement.children)
          .findIndex(otherElem => otherElem === elem);
        const qualified = qualifiedAsArticle(elem);
        if (!qualified) {
          console.log(`Removing unqualified element ${index}`, elem);
        }
        return {elem, index, qualified} as ArticleCandidate;
      })
      .filter(candidate => candidate.qualified)
      .map(candidate => candidate.index);

    const cssSelectorContextPath = 'body>' + FeedParser.getRelativePath(allMatches[0], iframeDocument.body);

    const code = `${matchingIndexes.map(index => `${cssSelectorContextPath}:nth-child(${index + 1})`).join(', ')} {
            border: 3px dotted red!important;
            margin-bottom: 5px!important;
            display: block;
          }
          `;

    const firstMatch = allMatches[0];
    if (firstMatch) {
      firstMatch.scrollIntoView();
    }

    styleNode.appendChild(iframeDocument.createTextNode(code));
    iframeDocument.head.appendChild(styleNode);
  }

  private evaluateXPathInIframe(xPath: string, context: HTMLElement | Document): HTMLElement[] {
    const iframeDocument = this.iframeRef.nativeElement.contentDocument;
    const xpathResult = iframeDocument.evaluate(xPath, context, null, 5);
    const nodes: HTMLElement[] = [];
    let node = xpathResult.iterateNext();
    while (node) {
      nodes.push(node as HTMLElement);
      node = xpathResult.iterateNext();
    }
    return nodes;
  }

  private updateParserOptions() {
    if (this.excludeItemsThatContain) {
      this.options.xq = this.excludeItemsThatContainTexts;
    } else {
      delete this.options.xq;
    }

    if (this.currentRule) {
      this.options.pContext = this.currentRule.contextXPath;
      this.options.pLink = this.currentRule.linkXPath;
    }
  }
}
