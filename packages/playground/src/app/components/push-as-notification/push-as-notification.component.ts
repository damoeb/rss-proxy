import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-push-as-notification',
  templateUrl: './push-as-notification.component.html',
  styleUrls: ['./push-as-notification.component.scss'],
})
export class PushAsNotificationComponent implements OnInit {
  hasChosen: boolean;
  mobile: boolean;
  web: boolean;

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
