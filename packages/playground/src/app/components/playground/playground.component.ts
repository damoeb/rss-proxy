import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { isEmpty } from 'lodash';
import { ActivatedRoute, Params, Router } from '@angular/router';

import {
  FeedDetectionResponse,
  FeedService,
  GenericFeedRule,
  NativeFeedRef,
} from '../../services/feed.service';
import { build } from '../../../environments/build';
import { AppSettingsService } from '../../services/app-settings.service';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

export type ArticleRecovery = 'none' | 'metadata' | 'full';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaygroundComponent implements OnInit {
  response: FeedDetectionResponse;
  errorMessage: string;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly router: Router,
    private readonly settings: AppSettingsService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly feedService: FeedService,
  ) {
    this.history = PlaygroundComponent.getHistory();
  }

  currentRule: GenericFeedRule = null;
  url: string;
  actualUrl: string;
  hasResults = false;
  iframeLoaded = false;
  isLoading = false;
  history: string[];

  canPrerender = false;
  showHistory: boolean;

  private static getHistory(): string[] {
    const localHistory = localStorage.getItem('history') || JSON.stringify([]);
    return environment.history || localHistory ? JSON.parse(localHistory) : [];
  }

  ngOnInit() {
    this.resetAll();
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.url) {
        this.url = params.url;
        this.parseFromUrlInternal();
      }
    });

    const settings = this.settings.get();
    this.canPrerender = settings.canPrerender;
    this.changeDetectorRef.detectChanges();
  }

  async parseFromUrl(url: string) {
    this.url = url;
    if (this.isLoading) {
      return;
    }
    if (this.activatedRoute.snapshot.queryParams.url === this.url) {
      this.parseFromUrlInternal();
    } else {
      const queryParams: Params = { url: this.url };

      return this.router.navigate([], {
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
    this.errorMessage = null;
  }

  getBuildDate() {
    const date = new Date(parseInt(this.getVersions().date, 10));
    return `${date.getUTCDate()}-${date.getUTCMonth()}-${date.getUTCFullYear()}`;
  }

  parseFromHistoryUrl(url: string) {
    return this.parseFromUrl(url);
  }

  private parseFromUrlInternal(): void {
    if (isEmpty(this.url)) {
      this.errorMessage = '';
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
      this.errorMessage = 'Please enter a valid url';
      this.changeDetectorRef.detectChanges();
      return;
    }
    this.isLoading = true;
    this.changeDetectorRef.detectChanges();

    this.fromStaticSource();
  }

  private fromStaticSource() {
    console.log('from static source');
    firstValueFrom(this.feedService.discover(this.url)).then(
      this.handleParserResponse(),
      (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.hasResults = false;
        this.errorMessage = error.message;
        this.changeDetectorRef.detectChanges();
      },
    );
  }

  private handleParserResponse() {
    return (response: FeedDetectionResponse) => {
      const results = response.results;

      results.genericFeedRules = results.genericFeedRules.map((gr, index) => {
        gr.id = index;
        return gr;
      });

      this.response = response;

      this.hasResults = true;
      this.isLoading = false;
      this.actualUrl = response.options.harvestUrl;
      if (results.failed) {
        console.error('Proxy replied an error.', results.errorMessage);
        // tslint:disable-next-line:max-line-length
        this.errorMessage = results.errorMessage;
      } else {
        console.log('Proxy replies an generated feed');
        // setTimeout(() => {
        //   this.applyRule(results.genericFeedRules[0]);
        // }, 1000);
        // todo mag add fallback option
      }
      this.changeDetectorRef.detectChanges();
    };
  }

  private addToHistory(url: string) {
    let history = this.history.filter((otherUrl) => otherUrl !== url);
    history = history.reverse();
    history.push(url);
    history = history.reverse();
    history = history.filter((otherUrl, index) => index < 15);

    this.history = history;

    localStorage.setItem('history', JSON.stringify(history));
  }
}
