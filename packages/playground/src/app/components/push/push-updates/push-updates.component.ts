import { Component, Input, OnInit } from '@angular/core';
import {
  GenericFeedWithParams,
  NativeFeedWithParams,
} from '../../../services/feed.service';

@Component({
  selector: 'app-push-updates',
  templateUrl: './push-updates.component.html',
  styleUrls: ['./push-updates.component.scss'],
})
export class PushUpdatesComponent implements OnInit {
  hasChosen: boolean;

  @Input()
  nativeFeed: NativeFeedWithParams;
  @Input()
  genericFeedRule: GenericFeedWithParams;

  webhook: boolean;
  pushNotification: boolean;
  email: boolean;
  calendar: boolean;

  constructor() {}

  ngOnInit(): void {}

  private use(fn: () => void) {
    this.reset();
    fn();
    this.hasChosen = true;
  }

  private reset() {
    this.hasChosen = false;
    this.webhook = null;
    this.email = null;
    this.pushNotification = null;
    this.calendar = null;
  }

  useWebhook() {
    this.use(() => {
      this.webhook = true;
    });
  }

  usePushNotification() {
    this.use(() => {
      this.pushNotification = true;
    });
  }

  useEmail() {
    this.use(() => {
      this.email = true;
    });
  }

  useCalendar() {
    this.use(() => {
      this.calendar = true;
    });
  }
}
