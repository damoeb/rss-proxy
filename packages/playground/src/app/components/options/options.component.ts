import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  FeedDetectionResponse,
  GenericFeedRule,
  NativeFeedRef,
  NativeFeedWithParams,
} from '../../services/feed.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionsComponent implements OnInit {
  @Input()
  response: FeedDetectionResponse;
  @Input()
  static: boolean;
  nativeFeeds: NativeFeedRef[];
  genericFeedRules: GenericFeedRule[];
  hasChosen: boolean;
  watchPageChanges: boolean;
  jsSupport: boolean;
  stateless: boolean;
  isNativeFeed: boolean;
  prerender: boolean;

  constructor(
    private readonly settings: SettingsService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  async ngOnInit(): Promise<void> {
    this.isNativeFeed =
      this.response.results.mimeType.toLowerCase().indexOf('xml') > -1;

    const s = this.settings.get();
    this.jsSupport = s.canPrerender;
    this.stateless = false;
    this.changeDetectorRef.detectChanges();
  }

  private use(fn: () => void) {
    this.reset();
    fn();
    this.hasChosen = true;
  }

  private reset() {
    this.nativeFeeds = null;
    this.genericFeedRules = null;
    this.prerender = null;
    this.watchPageChanges = null;
  }

  useNativeFeeds() {
    this.use(() => {
      this.nativeFeeds = this.response.results.nativeFeeds;
    });
  }

  useGenericFeeds() {
    this.use(() => {
      this.genericFeedRules = this.response.results.genericFeedRules;
    });
  }

  useWatchPageChanges() {
    this.use(() => {
      this.watchPageChanges = true;
    });
  }

  useDynamicRendering() {
    this.use(() => {
      this.prerender = true;
    });
  }

  createNativeFeed(): NativeFeedWithParams {
    return {
      feedUrl: this.response.options.harvestUrl,
    };
  }
}
