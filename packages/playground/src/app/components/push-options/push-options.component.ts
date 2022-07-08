import { Component, Input, OnInit } from '@angular/core';
import {
  GenericFeedWithParams,
  NativeFeedWithParams,
} from '../../services/feed.service';

@Component({
  selector: 'app-push-as-notification',
  templateUrl: './push-options.component.html',
  styleUrls: ['./push-options.component.scss'],
})
export class PushOptionsComponent implements OnInit {
  hasChosen: boolean;
  mobile: boolean;
  web: boolean;

  @Input()
  nativeFeed: NativeFeedWithParams;
  @Input()
  genericFeedRule: GenericFeedWithParams;

  constructor() {}

  ngOnInit(): void {}

  private use(fn: () => void) {
    this.reset();
    fn();
    this.hasChosen = true;
  }

  private reset() {
    this.mobile = null;
    this.web = null;
  }

  useMobile() {
    this.use(() => {
      this.mobile = true;
    });
  }

  useWeb() {
    this.use(() => {
      this.web = true;
    });
  }
}
