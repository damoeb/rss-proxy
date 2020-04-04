import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {

  @Input()
  name: string;

  @Input()
  tooltip: string;

  @Output()
  hide = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
