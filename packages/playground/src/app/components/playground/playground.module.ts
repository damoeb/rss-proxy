import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {PlaygroundComponent} from './playground.component';
import {PanelModule} from '../panel/panel.module';


@NgModule({
  declarations: [PlaygroundComponent],
  exports: [PlaygroundComponent],
  entryComponents: [PlaygroundComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PanelModule
  ]
})
export class PlaygroundModule {
}
