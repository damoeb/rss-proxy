import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  FeedDetectionResponse,
  FeedService,
  FeedWizardParams,
  GenericFeedRule,
  GenericFeedWithParams,
  NativeFeedRef,
  NativeFeedWithParams,
  PermanentFeed,
} from '../../services/feed.service';
import { patchHtml } from '../generic-feeds/generic-feeds.component';
import { ArticleRecovery } from '../playground/playground.component';
import { compact, debounce, find, isUndefined } from 'lodash';
import { JsonFeed } from '../feed/feed.component';
import {
  AppSettingsService,
  FeatureFlags,
} from '../../services/app-settings.service';
import { error } from 'toastr';

// credit https://stackoverflow.com/a/1349426
function makeid(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function injectHostScript(document: Document, randomId: string) {
  const body = document.documentElement.querySelector('body');
  body.append(
    new DOMParser().parseFromString(
      `<script>
window.addEventListener('message', (message) => {
    // reset
    Array.from(document.querySelectorAll('.w2f-link'))
        .filter(el => el.getAttribute('class'))
        .forEach(el => el.setAttribute('class', el.getAttribute('class').replace(' w2f-link', '')));

    // highlight
    if (message.data && message.data && message.data.urls) {
        const {urls} = message.data;

        Array.from(document.querySelectorAll('a[href]'))
            .filter(aElement => urls.includes(aElement.getAttribute('href')))
            .forEach((element, index) => {
              element.setAttribute('class', element.getAttribute('class') + ' w2f-link');
              if (index === 0) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
             });
    }
});
document.body.addEventListener('click', (event) => {
    const nodes = event.composedPath(); // TODO does not work in FF
    const bodyAt = nodes.indexOf(document.body);
    const pathFromBody = nodes.filter((_, index) => index < bodyAt).reverse().map(el => el.tagName).join('/');

    window.parent.postMessage("${randomId} "+pathFromBody, '*')
})
        </script>`,
      'text/html',
    ).documentElement,
  );
}

function disableClick(document: Document) {
  const head = document.documentElement.querySelector('head');
  head.append(
    new DOMParser().parseFromString(
      `<style>
.w2f-link {
    border: 3px solid blue;
    position: relative!important;
}
.w2f-link:before {
    content: 'LINK';
    background: blue;
    color: white;
    font-size: 12px;
    position: absolute;
    z-index: 10000;
    white-space: nowrap;
}
a, button { pointer-events: none; }
body { cursor: pointer; }
        </style>`,
      'text/html',
    ).documentElement,
  );
}

function createId(genericFeed: GenericFeedRule) {
  return compact(genericFeed.contextXPath.split('/'))
    .map((step) =>
      step.indexOf('[') > -1 ? step.substring(0, step.indexOf('[')) : step,
    )
    .join('/')
    .toLowerCase();
}

interface AnyFeed {
  genericFeed?: GenericFeedRule;
  nativeFeed?: NativeFeedRef;
  isGeneric: boolean;
  name: string;
  id: string;
}

type PlaygroundPhase = 'playground' | 'status' | 'welcome';

@Component({
  selector: 'app-welcome',
  templateUrl: './playground-stateless.component.html',
  styleUrls: ['./playground-stateless.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaygroundStatelessComponent implements OnInit, OnDestroy {
  url = '';

  @ViewChild('iframeElement', { static: true })
  iframeRef: ElementRef;
  response: FeedDetectionResponse;
  private unbindMessageListener: () => void;
  isLoadingDiscovery: boolean;
  phase: PlaygroundPhase;
  private busy = false;
  articleRecovery: ArticleRecovery = 'none';
  includeFilter = '';
  excludeFilter = '';
  currentFeedId: string;
  allFeeds: AnyFeed[];
  feedUrl: string;
  jsonFeed: JsonFeed;
  isLoadingFeed = false;
  prerendered = false;
  flags: FeatureFlags;
  applyDebounced: () => void;
  strictMode = true;
  showAdvancedOptions = false;
  showFeedUrlModal: boolean;
  effectiveFeedUrl: PermanentFeed;
  copyFeedUrlButtonText = 'Copy Feed URL';
  isFeedUrlCopied = false;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly activatedRoute: ActivatedRoute,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly feedService: FeedService,
    private readonly appSettings: AppSettingsService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.flags = this.appSettings.get().flags;
    this.applyDebounced = debounce(this.apply.bind(this), 500);

    this.clear();

    this.activatedRoute.queryParams.subscribe((params) => {
      let changed = false;
      if (!isUndefined(params.url)) {
        this.url = params.url;
        changed = true;
      }
      if (!isUndefined(params.strictMode)) {
        this.strictMode = params.strictMode === 'true';
        changed = true;
      }
      if (!isUndefined(params.prerendered)) {
        this.prerendered = params.prerendered === 'true';
        changed = true;
      }
      if (!isUndefined(params.articleRecovery)) {
        this.articleRecovery = params.articleRecovery;
        changed = true;
      }
      if (changed) {
        this.parseUrl();
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  async parseUrl() {
    if (this.busy) {
      return;
    }
    this.phase = 'status';
    await this.setUrlParams();
    this.busy = true;
    this.isLoadingDiscovery = true;

    try {
      console.log('try static');
      this.prerendered = false;
      this.response = await firstValueFrom(
        this.feedService.discover(
          this.url,
          '',
          this.prerendered,
          this.strictMode,
        ),
      )
        .then((response) => {
          if (
            response.results.failed ||
            (response.results.genericFeedRules.length === 0 &&
              response.results.mimeType.startsWith('text/html'))
          ) {
            console.log('try dynamic');
            this.prerendered = true;
            return firstValueFrom(
              this.feedService.discover(
                this.url,
                '',
                this.prerendered,
                this.strictMode,
              ),
            );
          } else {
            return response;
          }
        })
        .then((response) => {
          response.results.failed =
            response.results.genericFeedRules.length +
              response.results.nativeFeeds.length ===
            0;
          response.results.errorMessage =
            'No feeds found. ' + response.results.errorMessage;
          return response;
        });

      const generic = this.response.results.genericFeedRules.map(
        (genericFeed) => {
          return {
            id: createId(genericFeed),
            isGeneric: true,
            name: `in DOM with ${genericFeed.count} articles`,
            genericFeed,
          };
        },
      );

      const native = this.response.results.nativeFeeds.map((nativeFeed) => {
        return {
          id: nativeFeed.url,
          isGeneric: false,
          name: `Native ${nativeFeed.title}`,
          nativeFeed,
        };
      });
      this.allFeeds = [...native, ...generic];

      if (!this.response.results.failed) {
        setTimeout(() => {
          this.phase = 'playground';
          this.changeDetectorRef.detectChanges();
        }, 2000);
      }

      this.assignToIframe(this.response.results.body);
    } finally {
      console.log('done');
      this.isLoadingDiscovery = false;
      this.busy = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  private assignToIframe(html: string) {
    const randomId = makeid(10);
    const document = patchHtml(html, this.url);
    document.querySelectorAll('script').forEach((el) => el.remove());
    disableClick(document);
    injectHostScript(document, randomId);
    this.registerMessageListener(randomId);

    this.iframeRef.nativeElement.src = window.URL.createObjectURL(
      new Blob([document.documentElement.innerHTML], {
        type: 'text/html',
      }),
    );
    this.changeDetectorRef.detectChanges();
  }

  private registerMessageListener(randomId: string) {
    const messageListener = (e: MessageEvent) => {
      if (e?.data && e.data.indexOf && e.data.indexOf(randomId) === 0) {
        const path = e.data.substring(randomId.length + 1, e.data.length);
        this.suggestFeedForPath(path);
      }
    };
    window.addEventListener('message', messageListener);

    this.unbindMessageListener = () => {
      window.removeEventListener('message', messageListener);
    };
  }

  ngOnDestroy(): void {
    if (this.unbindMessageListener) {
      this.unbindMessageListener();
    }
  }

  suggestFeedForPath(path: string) {
    const currentFeed = this.allFeeds.find((anyFeed) => {
      return path.toLowerCase().indexOf(anyFeed.id) > -1;
    });
    if (currentFeed) {
      this.currentFeedId = currentFeed.id;
      this.apply();
    } else {
      this.currentFeedId = null;
      error(
        `No Feed matches the element you clicked. Maybe try the 'All Feeds' menu.`,
        null,
        {
          positionClass: 'toast-bottom-center',
          hideDuration: 3000,
          iconClass: undefined,
          progressBar: true,
        },
      );
      this.jsonFeed = null;
      this.iframeRef.nativeElement.contentWindow.postMessage({
        urls: [],
      });
      this.changeDetectorRef.detectChanges();
      console.log('No match');
    }
  }

  private apply() {
    console.log('apply');
    this.isLoadingFeed = true;
    this.jsonFeed = null;
    this.changeDetectorRef.detectChanges();
    const currentFeed = this.getCurrentFeed();

    if (currentFeed) {
      if (currentFeed.isGeneric) {
        console.log('generic');
        const params = this.getGenericParams();
        this.feedUrl = this.feedService.createFeedUrlForGeneric(params);
        firstValueFrom(this.feedService.fetchGenericFeed(params))
          .then((response) => this.handleResponse(response))
          .catch(console.error);
      } else {
        console.log('native');
        const params = this.getNativeParams();
        this.feedUrl = this.feedService.createFeedUrlForNative(params);
        firstValueFrom(this.feedService.transformNativeFeed(params))
          .then((response) => this.handleResponse(response))
          .catch(console.error);
      }
    }
  }

  private getFeedWizardParams(): FeedWizardParams {
    function parse(filterValue: string): string[] {
      return compact(
        filterValue
          .trim()
          .split(' ')
          .map((token) => token.trim()),
      );
    }

    const filter = [
      ...parse(this.includeFilter).map((t) => `contains('${t}')`),
      ...parse(this.excludeFilter).map((t) => `!(contains('${t}'))`),
    ].reduce((expr, query) => {
      if (expr) {
        return `and(${query}, ${expr})`;
      } else {
        return query;
      }
    }, '');
    return {
      filter,
      articleRecovery: this.articleRecovery,
      prerendered: this.prerendered,
    };
  }
  private getCurrentFeed(): AnyFeed {
    return find(this.allFeeds, { id: this.currentFeedId });
  }
  private getGenericParams(): GenericFeedWithParams {
    const currentFeed = this.getCurrentFeed();
    return {
      ...currentFeed.genericFeed,
      ...this.getFeedWizardParams(),
      harvestUrl: this.url,
    };
  }
  private getNativeParams(): NativeFeedWithParams {
    const currentFeed = this.getCurrentFeed();
    return {
      ...this.getFeedWizardParams(),
      feedUrl: currentFeed.nativeFeed.url,
    };
  }
  private handleResponse(response: any) {
    console.log('handleResponse', response);
    this.jsonFeed = response;
    this.iframeRef.nativeElement.contentWindow.postMessage({
      urls: this.jsonFeed.items.map((i) => i.url),
    });
    this.isLoadingFeed = false;
    this.changeDetectorRef.detectChanges();
  }

  clear() {
    this.url = '';
    this.phase = 'welcome';
    this.jsonFeed = null;
    this.strictMode = false;
    this.prerendered = false;
    this.currentFeedId = null;
    this.changeDetectorRef.detectChanges();
  }

  private setUrlParams() {
    const queryParams: Params = {
      url: this.url,
      ...this.getFeedWizardParams(),
      strictMode: this.strictMode,
    };

    return this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  async showFeedUrl() {
    this.showFeedUrlModal = true;
    const currentFeed = this.getCurrentFeed();
    if (currentFeed.genericFeed) {
      const genericParams = this.getGenericParams();
      genericParams.targetFormat = 'atom';
      const url = this.feedService.createFeedUrlForGeneric(genericParams);
      this.effectiveFeedUrl = await this.feedService.requestStandaloneFeedUrl(
        url,
      );
    }
    if (currentFeed.nativeFeed) {
      const nativeParams = this.getNativeParams();
      nativeParams.targetFormat = 'atom';
      const url = this.feedService.createFeedUrlForNative(nativeParams);
      this.effectiveFeedUrl = await this.feedService.requestStandaloneFeedUrl(
        url,
      );
    }
    this.changeDetectorRef.detectChanges();
  }

  copyFeedUrl() {
    const originalText = this.copyFeedUrlButtonText;
    this.copyFeedUrlButtonText = 'Copied';
    this.isFeedUrlCopied = true;
    setTimeout(() => {
      this.copyFeedUrlButtonText = originalText;
      this.isFeedUrlCopied = false;
      this.changeDetectorRef.detectChanges();
    }, 3000);
    this.changeDetectorRef.detectChanges();
    return navigator.clipboard.writeText(this.effectiveFeedUrl.feedUrl);
  }
}
