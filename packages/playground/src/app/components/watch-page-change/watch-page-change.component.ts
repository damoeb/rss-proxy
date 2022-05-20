import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-watch-page-change',
  templateUrl: './watch-page-change.component.html',
  styleUrls: ['./watch-page-change.component.scss']
})
export class WatchPageChangeComponent implements OnInit {

  @Input()
  body: string;
  @Input()
  siteUrl: string;

  constructor() { }

  ngOnInit(): void {
  }

}
