import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-convert-format',
  templateUrl: './convert-format.component.html',
  styleUrls: ['./convert-format.component.scss']
})
export class ConvertFormatComponent implements OnInit {

  @Input()
  feedUrl: string;

  constructor() { }

  ngOnInit(): void {
  }

}
