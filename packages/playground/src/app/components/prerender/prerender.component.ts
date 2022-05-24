import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import {
  FeedDetectionResponse,
  FeedService,
} from '../../services/feed.service';
import { firstValueFrom } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-prerender',
  templateUrl: './prerender.component.html',
  styleUrls: ['./prerender.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrerenderComponent implements OnInit, OnDestroy {
  @Input()
  siteUrl: string;

  puppeteerScript = `clickXPath; //button[text()="I Accept"]
clickXPath; //a[text()="No, Thank You"]
select; #download-os; macOS 10.14 (Mojave)
waitForXPath; //h2[text()="Individual Drivers"]`;

  hasChosen: boolean;
  watchPageChanges: boolean;
  genericFeedRules: boolean;
  error: boolean;
  errorMessage: string;
  private imageUrl: string;

  imageUrlSanitizes: SafeResourceUrl;
  response: FeedDetectionResponse;

  constructor(
    private readonly settings: SettingsService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly sanitizer: DomSanitizer,
    private readonly feed: FeedService,
  ) {}

  ngOnDestroy(): void {
    window.URL.revokeObjectURL(this.imageUrl);
  }

  ngOnInit(): void {
    firstValueFrom(
      this.feed.discover(this.siteUrl, this.puppeteerScript, true),
    ).then(
      (successResponse) => {
        this.error = false;
        this.handleResponse(successResponse);
      },
      (errorResponse) => {
        this.error = true;
        this.handleResponse(errorResponse);
      },
    );
  }

  private use(fn: () => void) {
    this.reset();
    fn();
    this.hasChosen = true;
  }

  private reset() {
    this.genericFeedRules = null;
    this.watchPageChanges = null;
  }

  useWatchPageChanges() {
    this.use(() => {
      this.watchPageChanges = true;
    });
  }

  useGenericFeeds() {
    this.use(() => {
      this.genericFeedRules = true;
    });
  }

  refresh() {}

  private handleResponse(response: FeedDetectionResponse) {
    console.log('response', response);
    const results = response.results;

    results.genericFeedRules = results.genericFeedRules.map((gr, index) => {
      gr.id = index;
      return gr;
    });

    this.response = response;
    this.errorMessage = results.errorMessage;

    const blob = new Blob([base64ToArrayBuffer(results.screenshot)], {
      type: 'image/png',
    });
    this.imageUrl = window.URL.createObjectURL(blob);
    this.imageUrlSanitizes = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.imageUrl,
    );
    this.changeDetectorRef.detectChanges();
  }
}

function base64ToArrayBuffer(base64: string): ArrayBufferLike {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
