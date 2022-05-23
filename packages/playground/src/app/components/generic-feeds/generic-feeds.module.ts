import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericFeedsComponent } from './generic-feeds.component';
import { SectionModule } from '../section/section.module';
import { RefineFeedModule } from '../refine-feed/refine-feed.module';

@NgModule({
  declarations: [GenericFeedsComponent],
  exports: [GenericFeedsComponent],
  imports: [CommonModule, SectionModule, RefineFeedModule],
})
export class GenericFeedsModule {}
