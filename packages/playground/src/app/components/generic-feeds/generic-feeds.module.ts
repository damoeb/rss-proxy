import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericFeedsComponent } from './generic-feeds.component';
import { SectionModule } from '../section/section.module';
import { RefineFeedModule } from '../refine-feed/refine-feed.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [GenericFeedsComponent],
  exports: [GenericFeedsComponent],
  imports: [CommonModule, SectionModule, FormsModule, RefineFeedModule],
})
export class GenericFeedsModule {}
