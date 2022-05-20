import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RefineFeedComponent} from './refine-feed.component';
import {SectionModule} from '../section/section.module';
import {ConvertFormatModule} from '../convert-format/convert-format.module';
import {PushUpdatesModule} from '../push-updates/push-updates.module';



@NgModule({
  declarations: [RefineFeedComponent],
  exports: [RefineFeedComponent],
  imports: [
    CommonModule,
    SectionModule,
    ConvertFormatModule,
    PushUpdatesModule
  ]
})
export class RefineFeedModule { }