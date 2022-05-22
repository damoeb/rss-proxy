import {Component, Input, OnInit} from '@angular/core';
import {GenericFeedWithParams, NativeFeedWithParams} from '../../services/feed.service';

@Component({
  selector: 'app-convert-format',
  templateUrl: './convert-format.component.html',
  styleUrls: ['./convert-format.component.scss']
})
export class ConvertFormatComponent implements OnInit {

  @Input()
  nativeFeed: NativeFeedWithParams;

  @Input()
  genericFeedRule: GenericFeedWithParams;

  constructor() { }

  ngOnInit(): void {
  }

}
