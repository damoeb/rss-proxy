import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FeedFormat,
  FeedService,
  GenericFeedWithParams,
  NativeFeedWithParams,
  PermanentFeed,
} from '../../services/feed.service';
import { JsonFeed } from '../feed/feed.component';
import { clone } from 'lodash';

@Component({
  selector: 'app-feed-url',
  templateUrl: './feed-url.component.html',
  styleUrls: ['./feed-url.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedUrlComponent implements OnInit, OnChanges {
  @Input()
  private nativeFeedValue: NativeFeedWithParams;
  @Input()
  private genericFeedValue: GenericFeedWithParams;
  nativeFeed: NativeFeedWithParams;
  genericFeed: GenericFeedWithParams;
  feed: JsonFeed;
  actualFeedUrl: string;
  loading: boolean;

  constructor(
    private readonly feedService: FeedService,
    private readonly changeRef: ChangeDetectorRef,
  ) {}

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes.nativeFeedValue && changes.nativeFeedValue.currentValue) {
      this.nativeFeed = clone(changes.nativeFeedValue.currentValue);
    }
    if (changes.genericFeedValue && changes.genericFeedValue.currentValue) {
      this.genericFeed = clone(changes.genericFeedValue.currentValue);
    }
    await this.requestFeedUrl();
    this.changeRef.detectChanges();
  }

  async ngOnInit(): Promise<void> {
    this.nativeFeed = clone(this.nativeFeedValue);
    this.genericFeed = clone(this.genericFeedValue);
  }

  private async requestFeedUrl(): Promise<void> {
    this.loading = true;
    this.actualFeedUrl = await this.requestPermanentFeedUrl();
    // this.message = permanentFeedUrl.message;
    this.loading = false;
  }

  private async requestPermanentFeedUrl(): Promise<PermanentFeed> {
    if (this.genericFeed) {
      return this.feedService.createFeedUrlForGeneric(this.genericFeed);
    }
    if (this.nativeFeed) {
      return this.feedService.createFeedUrlForNative(this.nativeFeed);
    }
  }

  format(): FeedFormat {
    if (this.genericFeed) {
      return this.genericFeed.targetFormat;
    } else {
      return this.nativeFeed?.targetFormat;
    }
  }

  copyUrl() {}
}
