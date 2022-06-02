import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ArticleRecovery } from '../../playground/playground.component';
import {
  FeedService,
  GenericFeedWithParams,
  NativeFeedWithParams,
} from '../../../services/feed.service';
import { firstValueFrom } from 'rxjs';
import { JsonFeed } from '../../feed/feed.component';

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
  nativeFeed: NativeFeedWithParams;
  @Input()
  genericFeedRule: GenericFeedWithParams;
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

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly feedService: FeedService,
  ) {}

  ngOnInit(): void {
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
    if (this.nativeFeed) {
      const params = this.nativeFeed;
      this.feedUrl = this.feedService.createFeedUrlForNative(params);
      firstValueFrom(this.feedService.transformNativeFeed(params)).then(
        (response) => this.handleResponse(response),
      );
    }
    if (this.genericFeedRule) {
      const params = this.genericFeedRule;
      this.feedUrl = this.feedService.createFeedUrlForGeneric(params);
      // todo mag feedUrl must be constructed from params
      firstValueFrom(this.feedService.fetchGenericFeed(params)).then(
        (response) => this.handleResponse(response),
      );
    }
  }

  private handleResponse(response: any) {
    this.jsonFeed = response;
    this.changeDetectorRef.detectChanges();
  }

  edit() {
    this.reset();
    this.hasChosen = false;
  }

  private valid() {
    return false;
  }
}
