import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NativeOptionsComponent } from './native-options.component';
import { SectionModule } from '../section/section.module';
import { MergeFeedsModule } from '../merge-feeds/merge-feeds.module';
import { ExportOptionsModule } from '../export-options/export-options.module';
import { RefineFeedModule } from '../refine-feed/refine-feed.module';

@NgModule({
  declarations: [NativeOptionsComponent],
  exports: [NativeOptionsComponent],
  imports: [
    CommonModule,
    SectionModule,
    MergeFeedsModule,
    ExportOptionsModule,
    RefineFeedModule,
  ],
})
export class NativeOptionsModule {}
