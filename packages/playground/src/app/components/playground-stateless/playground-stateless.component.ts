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
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  FeedDetectionResponse,
  FeedService,
  FeedWizardParams,
  GenericFeedRule,
  GenericFeedWithParams,
  NativeFeedRef,
  NativeFeedWithParams,
} from '../../services/feed.service';
import { patchHtml } from '../generic-feeds/generic-feeds.component';
import { ArticleRecovery } from '../playground/playground.component';
import { compact, debounce, find } from 'lodash';
import { JsonFeed } from '../feed/feed.component';
import {
  AppSettingsService,
  FeatureFlags,
} from '../../services/app-settings.service';

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
    Array.from(document.querySelectorAll('.w2f-link'))
        .filter(el => el.getAttribute('class'))
        .forEach(el => el.setAttribute('class', el.getAttribute('class').replace(' w2f-link', '')));

    if (message.data && message.data && message.data.isGeneric) {
        const genericFeed = message.data.genericFeed;

        const path = (message.data.genericFeed.contextXPath + genericFeed.linkXPath.replace('./', '/')).split('/')
          .filter(step => step)
          .map((step) => step.indexOf('[') > -1 ? step.substring(0, step.indexOf('[')) : step)
          .join('/');

        const result = document.evaluate(path, document.body, null, XPathResult.ANY_TYPE, null);
        const links = [];
        let next = result.iterateNext()
        while(next) {
            links.push(next);
            next = result.iterateNext();
        }
        links
          .forEach((element, index) => {
            element.setAttribute('class', element.getAttribute('class') + ' w2f-link');
            if (index === 0) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
           })
    }
});
document.body.addEventListener('click', (event) => {
    const nodes = event.path;
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
  loaderMessage: string;
  phase = 1;
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

  constructor(
    private readonly httpClient: HttpClient,
    private readonly activatedRoute: ActivatedRoute,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly feedService: FeedService,
    private readonly appSettings: AppSettingsService,
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.url) {
        this.url = params.url;
        this.changeDetectorRef.detectChanges();
      }
    });
    this.flags = this.appSettings.get().flags;
    this.applyDebounced = debounce(this.apply.bind(this), 300);
  }

  async parseUrl() {
    if (this.busy) {
      return;
    }
    this.setUrlParam('url', this.url);
    this.busy = true;
    this.setLoaderMessage('Parsing ...');
    console.log('try static');
    this.prerendered = false;
    this.response = await firstValueFrom(this.feedService.discover(this.url))
      .then((response) => {
        if (
          response.results.failed ||
          (response.results.genericFeedRules.length === 0 &&
            response.results.mimeType.startsWith('text/html'))
        ) {
          console.log('try dynamic');
          this.prerendered = true;
          return firstValueFrom(this.feedService.discover(this.url, '', true));
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

    this.setLoaderMessage(null);
    this.nextPhase();

    if (!this.response.results.failed) {
      setTimeout(() => this.nextPhase(), 2000);
    }

    this.assignToIframe(this.response.results.body);
    this.busy = false;
  }

  private assignToIframe(html: string) {
    const randomId = makeid(10);
    const document = patchHtml(html, this.url);

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
      console.log('No match');
    }
  }

  private setLoaderMessage(message: string) {
    this.loaderMessage = message;
    this.changeDetectorRef.detectChanges();
  }

  private nextPhase() {
    this.phase++;
    this.changeDetectorRef.detectChanges();
  }

  private apply() {
    console.log('apply');
    const currentFeed = find(this.allFeeds, { id: this.currentFeedId });
    this.iframeRef.nativeElement.contentWindow.postMessage(currentFeed);
    this.isLoadingFeed = true;
    this.jsonFeed = null;
    this.changeDetectorRef.detectChanges();

    const filter =
      this.includeFilter.trim() +
      ' ' +
      compact(this.excludeFilter.trim().split(' '))
        .map((s) => '-' + s)
        .join(' ');
    const wizardParams: FeedWizardParams = {
      filter,
      articleRecovery: this.articleRecovery,
      prerendered: this.prerendered,
    };
    if (currentFeed) {
      if (currentFeed.isGeneric) {
        console.log('generic');
        const params: GenericFeedWithParams = {
          ...currentFeed.genericFeed,
          ...wizardParams,
          harvestUrl: this.url,
        };
        this.feedUrl = this.feedService.createFeedUrlForGeneric(params);
        firstValueFrom(this.feedService.fetchGenericFeed(params)).then(
          (response) => this.handleResponse(response),
        );
      } else {
        console.log('native');
        const params: NativeFeedWithParams = {
          ...currentFeed.nativeFeed,
          ...wizardParams,
          feedUrl: this.url,
        };
        this.feedUrl = this.feedService.createFeedUrlForNative(params);
        firstValueFrom(this.feedService.transformNativeFeed(params)).then(
          (response) => this.handleResponse(response),
        );
      }
    }
  }

  private handleResponse(response: any) {
    this.jsonFeed = response;
    this.isLoadingFeed = false;
    this.changeDetectorRef.detectChanges();
  }

  clear() {
    this.url = '';
    this.phase = 1;
    this.jsonFeed = null;
    this.currentFeedId = null;
    this.changeDetectorRef.detectChanges();
  }

  private setUrlParam(param: string, value: string) {
    // todo
  }

  togglePrerendering() {
    this.prerendered = !this.prerendered;
    this.apply();
  }
}
