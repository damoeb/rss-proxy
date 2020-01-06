import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PanelComponent} from './panel.component';



@NgModule({
  declarations: [
    PanelComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PanelComponent
  ],
  entryComponents: [
    PanelComponent
  ]
})
export class PanelModule { }
