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
  feedUrl: string;
  loading: boolean;

  constructor(
    private readonly feedService: FeedService,
    private readonly changeRef: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes);
    if (changes.nativeFeedValue && changes.nativeFeedValue.currentValue) {
      this.nativeFeed = clone(changes.nativeFeedValue.currentValue);
      console.log('this.nativeFeed', this.nativeFeed);
    }
    if (changes.genericFeedValue && changes.genericFeedValue.currentValue) {
      this.genericFeed = clone(changes.genericFeedValue.currentValue);
      console.log('this.genericFeedRule', this.genericFeed);
    }
    this.feedUrl = this.getFeedUrl();
    this.changeRef.detectChanges();
  }

  async ngOnInit(): Promise<void> {
    this.nativeFeed = clone(this.nativeFeedValue);
    console.log('this.nativeFeed', this.nativeFeed);
    this.genericFeed = clone(this.genericFeedValue);
    console.log('this.genericFeedRule', this.genericFeed);

    this.loading = true;
    this.feedUrl = this.getFeedUrl();
    this.feed = await this.feedService.explainFeed(this.feedUrl);
    this.loading = false;
    this.changeRef.detectChanges();
  }

  private getFeedUrl(): string {
    if (this.genericFeed) {
      return this.feedService.createFeedUrlForGeneric(this.genericFeed);
    }
    if (this.nativeFeed) {
      return this.feedService.createFeedUrlForNative(this.nativeFeed);
    }
    return '';
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
