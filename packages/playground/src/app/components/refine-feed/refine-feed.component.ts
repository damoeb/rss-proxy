import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ContentResolution, ItemFilter} from '../playground/playground.component';
import {FeedService, GenericFeedRule, NativeFeedRef} from '../../services/feed.service';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-refine-feed',
  templateUrl: './refine-feed.component.html',
  styleUrls: ['./refine-feed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RefineFeedComponent implements OnInit {

  @Input()
  nativeFeed: NativeFeedRef;

  @Input()
  genericFeedRule: GenericFeedRule;

  contentResolution: ContentResolution = 'default';
  private filters: ItemFilter[];
  rawFeed: string;
  hasChosen: boolean;
  feedUrls: boolean;
  pushUpdates: boolean;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private feedService: FeedService) { }

  ngOnInit(): void {
    if (this.nativeFeed) {
      this.transform(this.nativeFeed.url);
    }
    if (this.genericFeedRule) {
      // todo mag feedUrl must be constructed from params
      this.transform(this.genericFeedRule.feedUrl);
    }
  }

  private transform(feedUrl: string) {
    firstValueFrom(this.feedService.transform(feedUrl, this.filters, this.contentResolution))
      .then(response => {
        try {
          this.rawFeed = JSON.stringify(response, null, 2);
        } catch (e) {
          this.rawFeed = response;
        }
        this.changeDetectorRef.detectChanges();
      })
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
    this.use(() => {this.feedUrls = true;})
  }

  usePushUpdate() {
    this.use(() => {this.pushUpdates = true;})
  }
}
