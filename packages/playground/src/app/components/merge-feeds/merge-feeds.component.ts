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
import { AppSettingsService } from '../../services/app-settings.service';

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
  hasChosen: boolean;
  newFeedUrl = '';
  feedSuggestions: any;
  isStateless: boolean;
  errorMessage: string;
  refine: boolean;
  export: boolean;

  constructor(
    private readonly feedService: FeedService,
    private readonly settings: AppSettingsService,
    private readonly changeRef: ChangeDetectorRef,
  ) {}

  async ngOnInit(): Promise<void> {
    this.feeds = [];
    await this.append(this.nativeFeed.feedUrl);
  }

  async append(feedUrl: string) {
    this.errorMessage = null;
    try {
      const feedRef = await this.feedService.explainFeed(feedUrl);
      this.feeds.push(feedRef);
    } catch (e) {
      this.errorMessage = 'This feed caused a problem';
    }
    this.newFeedUrl = '';
    this.changeRef.detectChanges();
  }

  createMergedFeed() {
    this.hasChosen = true;
    // todo create bucket
    // add feeds
  }

  async showFeedSuggestions(query: string) {
    if (!this.isStateless) {
      const realted = await this.feedService.findRelated(query);
    }
  }

  removeIndex(index: number) {
    this.feeds = this.feeds.filter((_, otherIndex) => index != otherIndex);
  }

  private use(fn: () => void) {
    this.createMergedFeed();
    this.reset();
    fn();
    this.hasChosen = true;
  }

  private reset() {
    this.export = null;
    this.refine = null;
  }

  useExport() {
    this.use(() => {
      this.export = true;
    });
  }

  useRefine() {
    this.use(() => {
      this.refine = true;
    });
  }
}
