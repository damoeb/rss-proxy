import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NativeOptionsComponent } from './native-options.component';
import { SectionModule } from '../section/section.module';
import { MergeFeedsModule } from '../merge-feeds/merge-feeds.module';
import { RefineOptionsModule } from '../refine-options/refine-options.module';
import { ExportOptionsModule } from '../export-options/export-options.module';

@NgModule({
  declarations: [NativeOptionsComponent],
  exports: [NativeOptionsComponent],
  imports: [
    CommonModule,
    SectionModule,
    MergeFeedsModule,
    RefineOptionsModule,
    ExportOptionsModule,
  ],
})
export class NativeOptionsModule {}
