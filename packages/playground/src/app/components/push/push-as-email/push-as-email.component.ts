import { Component, Input, OnInit } from '@angular/core';
import {
  GenericFeedWithParams,
  NativeFeedWithParams,
} from '../../../services/feed.service';

@Component({
  selector: 'app-push-as-email',
  templateUrl: './push-as-email.component.html',
  styleUrls: ['./push-as-email.component.scss'],
})
export class PushAsEmailComponent implements OnInit {
  @Input()
  nativeFeed: NativeFeedWithParams;
  @Input()
  genericFeedRule: GenericFeedWithParams;

  digest = 'no';
  email: string;

  constructor() {}

  ngOnInit(): void {}
}
