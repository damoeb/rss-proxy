import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ArticleRecovery } from '../playground/playground.component';
import {
  FeedFormat,
  FeedService,
  GenericFeedWithParams,
  NativeFeedRef,
  NativeFeedWithParams,
} from '../../services/feed.service';
import { firstValueFrom } from 'rxjs';
import { JsonFeed } from '../feed/feed.component';

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

  articleRecovery: ArticleRecovery = 'none';
  filter = '';

  jsonFeed: JsonFeed;
  hasChosen: boolean;
  feedUrls: boolean;
  pushUpdates: boolean;
  feedUrl: string;

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
    this.pushUpdates = null;
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
      const params = this.createFeedParamsForNative();
      this.feedUrl = this.feedService.createFeedUrlForNative(params);
      firstValueFrom(this.feedService.transformNativeFeed(params)).then(
        (response) => this.handleResponse(response),
      );
    }
    if (this.genericFeedRule) {
      const params = this.createFeedParamsForGeneric();
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

  createFeedParamsForNative(): NativeFeedWithParams {
    if (this.nativeFeed) {
      return {
        feedUrl: this.nativeFeed.url,
        filter: this.filter,
        articleRecovery: this.articleRecovery,
      };
    }
  }

  createFeedParamsForGeneric(): GenericFeedWithParams {
    if (this.genericFeedRule) {
      return {
        ...this.genericFeedRule,
        filter: this.filter,
        articleRecovery: this.articleRecovery,
      };
    }
  }
}
