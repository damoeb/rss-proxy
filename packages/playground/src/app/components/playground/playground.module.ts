import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {PlaygroundComponent} from './playground.component';
import {PanelModule} from '../panel/panel.module';
import {AccordionModule} from '../accordion/accordion.module';
import {DotModule} from '../dot/dot.module';


@NgModule({
  declarations: [PlaygroundComponent],
  exports: [PlaygroundComponent],
  entryComponents: [PlaygroundComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PanelModule,
    AccordionModule,
    DotModule
  ]
})
export class PlaygroundModule {
}
