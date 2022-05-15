import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {isEmpty} from 'lodash';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {Article, FeedDetectionResponse, FeedService, GenericFeedRule, NativeFeedRef} from '../../services/feed.service';
import {build} from '../../../environments/build';
import * as URI from 'urijs';
import {SettingsService} from '../../services/settings.service';

interface ArticleCandidate {
  elem: HTMLElement;
  index: number;
  qualified: boolean;
}


function getRelativeCssPath(node: HTMLElement, context: HTMLElement, withClassNames = false): string {
  if (node.nodeType === 3 || node === context) {
    // todo mag this is not applicable
    return 'self';
  }
  let path = node.tagName; // tagName for text nodes is undefined
  while (node.parentNode !== context) {
    node = node.parentNode as HTMLElement;
    if (typeof (path) === 'undefined') {
      path = getTagName(node, withClassNames);
    } else {
      path = `${getTagName(node, withClassNames)}>${path}`;
    }
  }
  return path;
}

function getTagName(node: HTMLElement, withClassNames: boolean): string {
  if (!withClassNames) {
    return node.tagName;
  }
  const classList = Array.from(node.classList)
    .filter(cn => cn.match('[0-9]+') === null);
  if (classList.length > 0) {
    return `${node.tagName}.${classList.join('.')}`;
  }
  return node.tagName;
}



@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaygroundComponent implements OnInit {
  response: FeedDetectionResponse;
  error: string;

  constructor(private httpClient: HttpClient,
              private sanitizer: DomSanitizer,
              private router: Router,
              private settings: SettingsService,
              private activatedRoute: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef,
              private feedService: FeedService) {
    this.history = PlaygroundComponent.getHistory();
  }

  @ViewChild('iframeElement', {static: false}) iframeRef: ElementRef;
  currentRule: GenericFeedRule;
  url: string;
  customContextXPath: string;
  customLinkXPath: string;
  showViz = 'viz';
  hasResults = false;
  iframeLoaded = false;
  options: any = {};
  isLoading = false;
  history: string[];
  currentTab: string;
  excludeItemsThatContain = false;
  excludeItemsThatContainTexts = 'Newsletter, Advertisement';

  private proxyUrl: string;
  hasJsSupport = false;

  private static getHistory(): string[] {
    return JSON.parse(localStorage.getItem('history') || JSON.stringify([]));
  }

  public ngOnInit() {
    this.resetAll();
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.url) {
        this.url = params.url;
        this.parseFromUrlInternal();
      }
    });

    this.settings.settings().then(settings => {
      this.hasJsSupport = settings.jsSupport;
      this.changeDetectorRef.detectChanges();
    });
  }

  public applyRule(rule: GenericFeedRule) {
    console.log('apply rule', rule);
    this.currentRule = rule;
    this.options.pContext = rule.contextXPath;
    this.options.pLink = rule.linkXPath;
    this.options.x = rule.extendContext;
    // this.feedService.applyRule(this.html, this.url, rule, this.options).subscribe(articles => {
    //   this.articles = articles;
    // });
    this.highlightRule(rule);
    this.changeDetectorRef.detectChanges();
  }

  public async parseFromUrl() {
    if (this.isLoading) {
      return;
    }
    if (this.activatedRoute.snapshot.queryParams.url === this.url) {
     this.parseFromUrlInternal();
    } else {
      const queryParams: Params = {url: this.url};

      return this.router.navigate(
        [],
        {
          relativeTo: this.activatedRoute,
          queryParams,
          queryParamsHandling: 'merge', // remove to replace all query params by provided
        });
    }
  }

  public applyCustomRule() {
    if (this.isLoading) {
      return;
    }
    // const rule: GenericFeedRule = {
    //   hidden: true,
    //   linkXPath: this.customLinkXPath,
    //   extendContext: 's',
    //   contextXPath: this.customContextXPath,
    //   id: 'custom',
    // };
    // this.applyRule(rule);
  }

  public getFeedUrl() {
    return this.currentRule.feedUrl;
  }

  getVersions() {
    return build;
  }

  public resetAll() {
    this.options = {
      // o: OutputType.ATOM,
      // c: ContentType.RAW,
      // xq: this.excludeItemsThatContainTexts,
      // js: false,
      // x: 's'
    };
    this.response = null;
    this.hasResults = false;
    this.iframeLoaded = false;
    this.currentRule = null;
    if (this.proxyUrl) {
      window.URL.revokeObjectURL(this.proxyUrl);
    }
    this.resetErrors();
    this.changeDetectorRef.detectChanges();
  }

  public resetErrors() {
    this.error = null;
  }

  public getBuildDate() {
    const date = new Date(parseInt(this.getVersions().date, 10));
    return `${date.getUTCDate()}-${date.getUTCMonth()}-${date.getUTCFullYear()}`;
  }

  public parseFromHistoryUrl(url: string) {
    this.url = url;
    return this.parseFromUrl();
  }

  public isCurrentRule(rule: GenericFeedRule): boolean {
    return this.currentRule === rule;
  }

  public onIframeLoad(): void {
    // if (this.response.results.genericFeedRules) {
    //   this.updateScores();
    // } else {
      this.iframeLoaded = true;
    // }
  }

  // public updateScores(): void {
  //   const iframeDocument = this.iframeRef.nativeElement.contentDocument;
  //   this.rules.forEach(rule => {
  //     const articles = this.evaluateXPathInIframe(rule.contextXPath, iframeDocument)
  //         // remove hidden articles
  //         .filter((elem: any) => !!(elem.offsetWidth || elem.offsetHeight))
  //       // remove empty articles
  //       // .filter((elem: any) => elem.textContent.trim() > 0)
  //       // .filter((elem: any) => Array.from(elem.querySelectorAll(rule.linkPath)).length > 0);
  //     ;
  //     if (articles.length === 0) {
  //       rule.score -= 20;
  //       // rule.hidden = true;
  //     }
  //   });
  //   this.changeDetectorRef.detectChanges();
  // }

  private parseFromUrlInternal(): void {
    if (isEmpty(this.url)) {
      this.error = '';
      this.changeDetectorRef.detectChanges();
      return;
    }

    this.resetErrors();
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
    this.changeDetectorRef.detectChanges();

    this.updateParserOptions();

    this.fromStaticSource();
  }

  private fromStaticSource() {
    console.log('from static source');
    this.feedService.fromUrl(this.url)
      .subscribe(this.handleParserResponse(), (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.hasResults = false;
        this.error = error.message;
        this.changeDetectorRef.detectChanges();
      });
  }

  private handleParserResponse() {
    return (response: FeedDetectionResponse) => {
      const results = response.results;
      this.response = response;
      this.hasResults = true;
      this.isLoading = false;
      this.url = response.options.harvestUrl;
      if (results.failed) {
        this.prepareIframe(this.patchHtml(results.body, this.url));

        console.error('Proxy replied an error.', results.errorMessage);
        // tslint:disable-next-line:max-line-length
        this.error = `Looks like this site does not contain any feed data.`;
      } else {
        console.log('Proxy replies an generated feed');
        this.prepareIframe(this.patchHtml(results.body, this.url));
        setTimeout(() => {
          this.applyRule(results.genericFeedRules[0]);
        }, 1000);
        this.setCurrentTab(this.showViz);
        // const optionsFromParser = response.options;
        // this.options.c = optionsFromParser.c;
        // this.options.o = optionsFromParser.o;
        // todo mag add fallback option
        this.changeDetectorRef.detectChanges();
      }
    };
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

  private assignToIframe(html: string) {
    this.proxyUrl = window.URL.createObjectURL(new Blob([html], {
      type: 'text/html'
    }));
    this.iframeRef.nativeElement.src = this.proxyUrl;
    this.changeDetectorRef.detectChanges();
  }

  private prepareIframe(html: string) {
    this.assignToIframe(html);
  }

  private patchHtml(html: string, url: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const base = doc.createElement('base');
    base.setAttribute('href', url);
    doc.getElementsByTagName('head').item(0).appendChild(base);

    Array.from(doc.querySelectorAll('[href]')).forEach(el => {
      try {
        const absoluteUrl = new URI(el.getAttribute('href')).absoluteTo(url);
        el.setAttribute('href', absoluteUrl.toString());
      } catch (e) {
        // console.error(e);
      }
    });


    return doc.documentElement.innerHTML;
  }

  private highlightRule(rule: GenericFeedRule): void {
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

    const matchingIndexes = allMatches
      .map(elem => {
        const index = Array.from(elem.parentElement.children)
          .findIndex(otherElem => otherElem === elem);
        const qualified = true;
        if (qualified) {
          console.log(`Keeping element ${index}`, elem);
        } else {
          console.log(`Removing unqualified element ${index}`, elem);
        }
        return {elem, index, qualified} as ArticleCandidate;
      })
      .filter(candidate => candidate.qualified)
      .map(candidate => candidate.index);

    const cssSelectorContextPath = 'body>' + getRelativeCssPath(allMatches[0], iframeDocument.body, true);
    console.log(cssSelectorContextPath);
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

  canChooseFeed(): boolean {
    try {
      return this.response.results.nativeFeeds.length > 0
    } catch (e) {
      return false;
    }
  }
}
