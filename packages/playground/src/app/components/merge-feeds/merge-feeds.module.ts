import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MergeFeedsComponent } from './merge-feeds.component';
import { SectionModule } from '../section/section.module';
import { FormsModule } from '@angular/forms';
import { SearchModule } from '../search/search.module';
import { RefineOptionsModule } from '../refine-options/refine-options.module';
import { ExportOptionsModule } from '../export-options/export-options.module';

@NgModule({
  declarations: [MergeFeedsComponent],
  exports: [MergeFeedsComponent],
  imports: [
    CommonModule,
    SectionModule,
    FormsModule,
    SearchModule,
    RefineOptionsModule,
    ExportOptionsModule,
  ],
})
export class MergeFeedsModule {}
