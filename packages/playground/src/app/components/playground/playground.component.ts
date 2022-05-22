import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {isEmpty} from 'lodash';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {FeedDetectionResponse, FeedService, GenericFeedRule, NativeFeedRef} from '../../services/feed.service';
import {build} from '../../../environments/build';
import {SettingsService} from '../../services/settings.service';

export type ContentResolution = 'default' | 'fulltext' | 'oc';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaygroundComponent implements OnInit {
  response: FeedDetectionResponse;
  error: string;
  currentNativeFeed: NativeFeedRef;
  contentResolution: ContentResolution = 'default';


  constructor(private httpClient: HttpClient,
              private router: Router,
              private settings: SettingsService,
              private activatedRoute: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef,
              private feedService: FeedService) {
    this.history = PlaygroundComponent.getHistory();
  }

  currentRule: GenericFeedRule = null;
  url: string;
  actualUrl: string;
  hasResults = false;
  iframeLoaded = false;
  isLoading = false;
  history: string[];

  hasJsSupport = false;
  showHistory: boolean;

  private static getHistory(): string[] {
    return JSON.parse(localStorage.getItem('history') || JSON.stringify([]));
  }

  ngOnInit() {
    this.resetAll();
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.url) {
        this.url = params.url;
        this.parseFromUrlInternal();
      }
    });

    this.settings.serverSettings().then(settings => {
      this.hasJsSupport = settings.jsSupport;
      this.changeDetectorRef.detectChanges();
    });
  }

  async parseFromUrl() {
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

  getVersions() {
    return build;
  }

  resetAll() {
    this.response = null;
    this.hasResults = false;
    this.actualUrl = null;
    this.iframeLoaded = false;
    this.currentRule = null;
    this.resetErrors();
    this.changeDetectorRef.detectChanges();
  }

  resetErrors() {
    this.error = null;
  }

  getBuildDate() {
    const date = new Date(parseInt(this.getVersions().date, 10));
    return `${date.getUTCDate()}-${date.getUTCMonth()}-${date.getUTCFullYear()}`;
  }

  parseFromHistoryUrl(url: string) {
    this.url = url;
    return this.parseFromUrl();
  }

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

    this.fromStaticSource();
  }

  private fromStaticSource() {
    console.log('from static source');
    this.feedService.discover(this.url)
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

      results.genericFeedRules = results.genericFeedRules.map((gr, index) => {
        gr.id = index;
        return gr;
      })

      this.response = response;

      this.hasResults = true;
      this.isLoading = false;
      this.actualUrl = response.options.harvestUrl;
      if (results.failed) {

        console.error('Proxy replied an error.', results.errorMessage);
        // tslint:disable-next-line:max-line-length
        this.error = `Looks like this site does not contain any feed data.`;
      } else {
        console.log('Proxy replies an generated feed');
        // setTimeout(() => {
        //   this.applyRule(results.genericFeedRules[0]);
        // }, 1000);
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
}
