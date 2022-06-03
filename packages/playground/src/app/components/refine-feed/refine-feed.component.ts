import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ArticleRecovery } from '../playground/playground.component';
import {
  FeedService,
  FeedWizardParams,
  GenericFeedWithParams,
  NativeFeedWithParams,
} from '../../services/feed.service';
import { firstValueFrom } from 'rxjs';
import { JsonFeed } from '../feed/feed.component';
import {
  AppSettingsService,
  FeatureFlags,
} from '../../services/app-settings.service';
import { clone } from 'lodash';

interface FilterExample {
  name: string;
  value: string;
}

@Component({
  selector: 'app-refine-feed',
  templateUrl: './refine-feed.component.html',
  styleUrls: ['./refine-feed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefineFeedComponent implements OnInit {
  @Input()
  private nativeFeedValue: NativeFeedWithParams;
  @Input()
  private genericFeedValue: GenericFeedWithParams;
  nativeFeed: NativeFeedWithParams;
  genericFeed: GenericFeedWithParams;
  @Input()
  showArticleRecovery: boolean;
  @Input()
  showDigest: boolean;
  @Input()
  showThrottle: boolean;
  @Input()
  showFilter: boolean;

  articleRecovery: ArticleRecovery = 'none';
  filter = '';
  loading = false;

  jsonFeed: JsonFeed;
  hasChosen: boolean;
  export: boolean;
  feedUrl: string;
  filterSamples: FilterExample[] = [
    {
      name: 'Choose from samples',
      value: '',
    },
    {
      name: 'Must include',
      value: 'keyword',
    },
    {
      name: 'Must not include',
      value: '-Advertisment',
    },
    {
      name: 'With link count',
      value: 'links > 0',
    },
  ];
  currentSample = '';

  digestWindow = '';
  digestStartingAt: Date;

  useThrottling = false;
  throttleMaxArticles = 5;
  throttleSortBy = 'score';
  useDigest = false;
  flags: FeatureFlags;

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly feedService: FeedService,
    private readonly appSettings: AppSettingsService,
  ) {}

  ngOnInit(): void {
    this.nativeFeed = clone(this.nativeFeedValue);
    this.genericFeed = clone(this.genericFeedValue);

    this.flags = this.appSettings.get().flags;
    this.apply();
  }

  private use(fn: () => void) {
    if (this.valid()) {
      this.reset();
      fn();
      this.hasChosen = true;
    }
  }

  private reset() {
    this.export = null;
  }

  useExport() {
    this.use(() => {
      this.export = true;
    });
  }

  apply() {
    this.loading = true;
    this.jsonFeed = null;
    if (this.nativeFeed) {
      const params = this.updateParams<NativeFeedWithParams>(this.nativeFeed);
      this.feedUrl = this.feedService.createFeedUrlForNative(params);
      firstValueFrom(this.feedService.transformNativeFeed(params)).then(
        (response) => this.handleResponse(response),
      );
    }
    if (this.genericFeed) {
      const params = this.updateParams<GenericFeedWithParams>(this.genericFeed);
      this.feedUrl = this.feedService.createFeedUrlForGeneric(params);
      // todo mag feedUrl must be constructed from params
      firstValueFrom(this.feedService.fetchGenericFeed(params)).then(
        (response) => this.handleResponse(response),
      );
    }
  }

  private handleResponse(response: any) {
    this.jsonFeed = response;
    this.loading = false;
    this.changeDetectorRef.detectChanges();
  }

  edit() {
    this.reset();
    this.hasChosen = false;
  }

  private valid() {
    return true;
  }

  private updateParams<T extends FeedWizardParams>(feed: T): T {
    feed.filter = this.filter;
    feed.articleRecovery = this.articleRecovery;
    return feed;
  }
}
