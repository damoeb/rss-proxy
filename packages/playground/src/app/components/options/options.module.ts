import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionsComponent } from './options.component';
import { GenericFeedsModule } from '../generic-feeds/generic-feeds.module';
import { NativeFeedsModule } from '../native-feeds/native-feeds.module';
import { SectionModule } from '../section/section.module';
import { WatchPageChangeModule } from '../watch-page-change/watch-page-change.module';
import { PrerenderModule } from '../prerender/prerender.module';
import { NativeOptionsModule } from '../native-options/native-options.module';
import { HelpMessageModule } from '../help-message/help-message.module';

@NgModule({
  declarations: [OptionsComponent],
  exports: [OptionsComponent],
  imports: [
    CommonModule,
    GenericFeedsModule,
    NativeFeedsModule,
    SectionModule,
    WatchPageChangeModule,
    PrerenderModule,
    NativeOptionsModule,
    HelpMessageModule,
  ],
})
export class OptionsModule {}
