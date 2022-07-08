import { Component, Input, OnInit } from '@angular/core';

export interface JsonFeedItem {
  id: string;
  title: string;
  content_text: string;
  content_raw: string;
  content_raw_mime: string;
  url: string;
  date_published: string;
  tags: string[];
  image: string;
  author: string;
  enclosures: any;
  commentsFeedUrl: string;
}

export interface JsonFeed {
  id: string;

  last_url: string;
  previous_url: string;
  next_url: string;
  feed_url: string;

  expired: false;
  title: string;
  description: string;
  home_page_url: string;
  date_published: string;
  items: JsonFeedItem[];
  lastPage: number;
  selfPage: number;
  tags: string[];
}

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {
  @Input()
  jsonFeed: JsonFeed;

  @Input()
  header = true;

  constructor() {}

  ngOnInit(): void {}
}
