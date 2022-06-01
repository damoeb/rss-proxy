import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MergeFeedsComponent } from './merge-feeds.component';
import { SectionModule } from '../section/section.module';
import { RefineFeedModule } from '../refine-feed/refine-feed.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [MergeFeedsComponent],
  exports: [MergeFeedsComponent],
  imports: [CommonModule, SectionModule, FormsModule, RefineFeedModule],
})
export class MergeFeedsModule {}
