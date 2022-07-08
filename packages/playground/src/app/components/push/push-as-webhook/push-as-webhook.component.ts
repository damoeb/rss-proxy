import { Component, Input, OnInit } from '@angular/core';
import {
  GenericFeedWithParams,
  NativeFeedWithParams,
} from '../../../services/feed.service';

@Component({
  selector: 'app-push-as-webhook',
  templateUrl: './push-as-webhook.component.html',
  styleUrls: ['./push-as-webhook.component.scss'],
})
export class PushAsWebhookComponent implements OnInit {
  @Input()
  nativeFeed: NativeFeedWithParams;
  @Input()
  genericFeedRule: GenericFeedWithParams;

  constructor() {}

  ngOnInit(): void {}
}
