import { Component, Input, OnInit } from '@angular/core';

export interface SiteUrl {
  url: string;
  prerender?: boolean;
  script?: string;
}

@Component({
  selector: 'app-watch-page-change',
  templateUrl: './watch-page-change.component.html',
  styleUrls: ['./watch-page-change.component.scss'],
})
export class WatchPageChangeComponent implements OnInit {
  @Input()
  body: string;
  @Input()
  siteUrl: SiteUrl;
  mode = 'readability';

  constructor() {}

  ngOnInit(): void {}
}
