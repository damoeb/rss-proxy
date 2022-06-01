import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  FeedService,
  NativeFeedRef,
  NativeFeedWithParams,
} from '../../services/feed.service';
import { JsonFeed } from '../feed/feed.component';

@Component({
  selector: 'app-merge-feeds',
  templateUrl: './merge-feeds.component.html',
  styleUrls: ['./merge-feeds.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MergeFeedsComponent implements OnInit {
  @Input()
  nativeFeed: NativeFeedWithParams;

  feeds: JsonFeed[];
  mergedFeed: NativeFeedRef;
  refine: boolean;
  newFeedUrl = '';

  constructor(
    private readonly feedService: FeedService,
    private readonly changeRef: ChangeDetectorRef,
  ) {}

  async ngOnInit(): Promise<void> {
    this.feeds = [];
    await this.append(this.nativeFeed.feedUrl);
  }

  async append(feedUrl: string) {
    const feedRef = await this.feedService.explainFeed(feedUrl);
    this.feeds.push(feedRef);
    this.newFeedUrl = '';
    this.changeRef.detectChanges();
  }

  createMergedFeed() {
    this.refine = true;
    // todo create bucket
    // add feeds
  }
}
