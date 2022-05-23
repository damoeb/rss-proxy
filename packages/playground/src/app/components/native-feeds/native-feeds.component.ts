import { Component, Input, OnInit } from '@angular/core';
import { NativeFeedRef } from '../../services/feed.service';

@Component({
  selector: 'app-native-feeds',
  templateUrl: './native-feeds.component.html',
  styleUrls: ['./native-feeds.component.scss'],
})
export class NativeFeedsComponent implements OnInit {
  @Input()
  nativeFeeds: NativeFeedRef[];
  currentNativeFeed: NativeFeedRef;
  hasChosen: boolean;

  constructor() {}

  ngOnInit(): void {}

  useFeed(feed: NativeFeedRef) {
    this.currentNativeFeed = feed;
    this.hasChosen = true;
  }
}
