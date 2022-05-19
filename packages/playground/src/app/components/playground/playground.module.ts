import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {PlaygroundComponent} from './playground.component';


@NgModule({
  declarations: [PlaygroundComponent],
  exports: [PlaygroundComponent],
  entryComponents: [PlaygroundComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ]
})
export class PlaygroundModule {
}
