import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-push-updates',
  templateUrl: './push-updates.component.html',
  styleUrls: ['./push-updates.component.scss']
})
export class PushUpdatesComponent implements OnInit {
  hasChosen: boolean;

  @Input()
  feedUrl: string;
  webhook: boolean;
  pushNotification: boolean;
  email: boolean;

  constructor() { }

  ngOnInit(): void {
  }

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
  }

  useWebhook() {
    this.use(() => {
      this.webhook = true;
    });
  }

  usePushNotification() {
    this.use(() => {
      this.pushNotification = true;
    })
  }

  useEmail() {
    this.use(() => {
      this.email = true;
    })
  }
}