import { Component, Input, OnInit } from '@angular/core';
import {
  NativeFeedRef,
  NativeFeedWithParams,
} from '../../services/feed.service';

@Component({
  selector: 'app-refine-options',
  templateUrl: './refine-options.component.html',
  styleUrls: ['./refine-options.component.scss'],
})
export class RefineOptionsComponent implements OnInit {
  hasChosen: boolean;
  throttle: boolean;
  filter: boolean;
  content: boolean;

  @Input()
  nativeFeed: NativeFeedWithParams;
  digest: boolean;

  constructor() {}

  ngOnInit(): void {}

  private use(fn: () => void) {
    this.reset();
    fn();
    this.hasChosen = true;
  }

  private reset() {
    this.throttle = null;
    this.filter = null;
    this.content = null;
    this.digest = null;
  }

  useThrottle() {
    this.use(() => {
      this.throttle = true;
    });
  }

  useFilter() {
    this.use(() => {
      this.filter = true;
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
