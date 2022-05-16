import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-accordeon',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements OnInit {

  @Input()
  expanded: boolean

  @Input()
  canToggle = true

  constructor() { }

  ngOnInit() {
  }

  tryToggle() {
    if (this.canToggle) {
      this.expanded = !this.expanded;
    }
  }
}
