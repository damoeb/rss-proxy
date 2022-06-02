import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MergeFeedsComponent } from './merge-feeds.component';
import { SectionModule } from '../section/section.module';
import { FormsModule } from '@angular/forms';
import { SearchModule } from '../search/search.module';
import { ExportOptionsModule } from '../export-options/export-options.module';
import { RefineFeedModule } from '../refine-feed/refine-feed.module';

@NgModule({
  declarations: [MergeFeedsComponent],
  exports: [MergeFeedsComponent],
  imports: [
    CommonModule,
    SectionModule,
    FormsModule,
    SearchModule,
    ExportOptionsModule,
    RefineFeedModule,
  ],
})
export class MergeFeedsModule {}
