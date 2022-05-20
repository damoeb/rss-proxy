import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WatchPageChangeComponent} from './watch-page-change.component';
import {SectionModule} from '../section/section.module';



@NgModule({
  declarations: [WatchPageChangeComponent],
  exports: [WatchPageChangeComponent],
  imports: [
    CommonModule,
    SectionModule
  ]
})
export class WatchPageChangeModule { }
