import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ContentResolution } from '../playground/playground.component';
import {
  FeedFormat,
  FeedService,
  GenericFeedWithParams,
  NativeFeedRef,
  NativeFeedWithParams,
} from '../../services/feed.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-refine-feed',
  templateUrl: './refine-feed.component.html',
  styleUrls: ['./refine-feed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefineFeedComponent implements OnInit {
  @Input()
  nativeFeed: NativeFeedRef;

  @Input()
  genericFeedRule: GenericFeedWithParams;

  contentResolution: ContentResolution = 'default';
  filter = '';

  rawFeed: string;
  hasChosen: boolean;
  feedUrls: boolean;
  pushUpdates: boolean;
  filterSamples = [{ name: 'linkCount', value: 'wefwef' }];

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly feedService: FeedService,
  ) {}

  ngOnInit(): void {
    this.apply();
  }

  private use(fn: () => void) {
    this.reset();
    fn();
    this.hasChosen = true;
  }

  private reset() {
    this.feedUrls = null;
  }

  useFeedUrls() {
    this.use(() => {
      this.feedUrls = true;
    });
  }

  usePushUpdate() {
    this.use(() => {
      this.pushUpdates = true;
    });
  }

  apply() {
    if (this.nativeFeed) {
      firstValueFrom(
        this.feedService.transformNativeFeed(this.createNativeFeedWithParams()),
      ).then((response) => this.handleResponse(response));
    }
    if (this.genericFeedRule) {
      console.log(this.genericFeedRule.feedUrl);
      // todo mag feedUrl must be constructed from params
      firstValueFrom(
        this.feedService.fetchGenericFeed(
          this.createGenericFeedRuleWithParams(),
        ),
      ).then((response) => this.handleResponse(response));
    }
  }

  private handleResponse(response: any) {
    try {
      this.rawFeed = JSON.stringify(response, null, 2).trim();
    } catch (e) {
      this.rawFeed = response.trim();
    }
    this.changeDetectorRef.detectChanges();
  }

  createFeedUrl(): string {
    return this.feedService.createFeedUrlFromGenericFeed(this.genericFeedRule);
  }

  createNativeFeedWithParams(): NativeFeedWithParams {
    if (this.nativeFeed) {
      return {
        feedUrl: this.nativeFeed.url,
        filter: this.filter,
        contentResolution: this.contentResolution,
      };
    }
  }

  createGenericFeedRuleWithParams(): GenericFeedWithParams {
    if (this.genericFeedRule) {
      return {
        ...this.genericFeedRule,
        filter: this.filter,
        contentResolution: this.contentResolution,
      };
    }
  }
}
