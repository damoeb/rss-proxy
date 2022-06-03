import { Component, Input, OnInit } from '@angular/core';
import {
  FeedFormat,
  GenericFeedWithParams,
  NativeFeedWithParams,
} from '../../services/feed.service';
import { clone } from 'lodash';

@Component({
  selector: 'app-convert-format',
  templateUrl: './convert-format.component.html',
  styleUrls: ['./convert-format.component.scss'],
})
export class ConvertFormatComponent implements OnInit {
  @Input()
  private nativeFeedValue: NativeFeedWithParams;
  @Input()
  private genericFeedValue: GenericFeedWithParams;
  nativeFeed: NativeFeedWithParams;
  genericFeed: GenericFeedWithParams;

  format: FeedFormat;

  constructor() {}

  ngOnInit(): void {
    this.nativeFeed = clone(this.nativeFeedValue);
    this.genericFeed = clone(this.genericFeedValue);
  }

  applyFormat(format: FeedFormat) {
    this.format = format;

    if (this.nativeFeed) {
      this.nativeFeed.targetFormat = format;
    } else {
      this.genericFeed.targetFormat = format;
    }
  }

  getNativeFeed() {
    // to change the ref and force update
    return clone(this.nativeFeed);
  }

  getGenericFeed() {
    // to change the ref and force update
    return clone(this.genericFeed);
  }
}
