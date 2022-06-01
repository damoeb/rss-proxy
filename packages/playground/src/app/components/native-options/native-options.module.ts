import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NativeOptionsComponent } from './native-options.component';
import { PushUpdatesModule } from '../push-updates/push-updates.module';
import { ConvertFormatModule } from '../convert-format/convert-format.module';
import { RefineFeedModule } from '../refine-feed/refine-feed.module';
import { SectionModule } from '../section/section.module';
import { MergeFeedsModule } from '../merge-feeds/merge-feeds.module';

@NgModule({
  declarations: [NativeOptionsComponent],
  exports: [NativeOptionsComponent],
  imports: [
    CommonModule,
    PushUpdatesModule,
    ConvertFormatModule,
    RefineFeedModule,
    SectionModule,
    MergeFeedsModule,
  ],
})
export class NativeOptionsModule {}
