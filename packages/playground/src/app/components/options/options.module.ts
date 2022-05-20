import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OptionsComponent} from './options.component';
import {GenericFeedsModule} from '../generic-feeds/generic-feeds.module';
import {NativeFeedsModule} from '../native-feeds/native-feeds.module';
import {SectionModule} from '../section/section.module';
import {WatchPageChangeModule} from '../watch-page-change/watch-page-change.module';
import {PushUpdatesModule} from '../push-updates/push-updates.module';
import {ConvertFormatModule} from '../convert-format/convert-format.module';
import {PrerenderModule} from '../prerender/prerender.module';



@NgModule({
  declarations: [OptionsComponent],
  exports: [OptionsComponent],
  imports: [
    CommonModule,
    GenericFeedsModule,
    NativeFeedsModule,
    SectionModule,
    WatchPageChangeModule,
    PushUpdatesModule,
    ConvertFormatModule,
    PrerenderModule
  ]
})
export class OptionsModule { }
