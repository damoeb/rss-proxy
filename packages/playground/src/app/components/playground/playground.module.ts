import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PlaygroundComponent} from './playground.component';
import {FormsModule} from '@angular/forms';
import {PanelModule} from '../panel/panel.module';



@NgModule({
  declarations: [ PlaygroundComponent ],
  exports: [ PlaygroundComponent ],
  entryComponents: [ PlaygroundComponent ],
  imports: [
    CommonModule,
    FormsModule,
    PanelModule
  ]
})
export class PlaygroundModule { }
