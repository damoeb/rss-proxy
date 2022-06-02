import { Component, Input, OnInit } from '@angular/core';
import {
  GenericFeedWithParams,
  NativeFeedWithParams,
} from '../../services/feed.service';

@Component({
  selector: 'app-export-options',
  templateUrl: './export-options.component.html',
  styleUrls: ['./export-options.component.scss'],
})
export class ExportOptionsComponent implements OnInit {
  hasChosen: boolean;
  convert: boolean;
  push: boolean;
  content: boolean;

  @Input()
  nativeFeed: NativeFeedWithParams;
  @Input()
  genericFeedRule: GenericFeedWithParams;

  digest: boolean;

  constructor() {}

  ngOnInit(): void {}

  private use(fn: () => void) {
    this.reset();
    fn();
    this.hasChosen = true;
  }

  private reset() {
    this.convert = null;
    this.push = null;
    this.content = null;
  }

  useConvert() {
    this.use(() => {
      this.convert = true;
    });
  }

  usePush() {
    this.use(() => {
      this.push = true;
    });
  }

  useContent() {
    this.use(() => {
      this.content = true;
    });
  }

  useDigest() {
    this.use(() => {
      this.digest = true;
    });
  }
}
