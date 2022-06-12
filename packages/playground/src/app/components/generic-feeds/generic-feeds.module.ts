import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericFeedsComponent } from './generic-feeds.component';
import { SectionModule } from '../section/section.module';
import { FormsModule } from '@angular/forms';
import { RefineFeedModule } from '../refine-feed/refine-feed.module';
import { HelpMessageModule } from '../help-message/help-message.module';

@NgModule({
  declarations: [GenericFeedsComponent],
  exports: [GenericFeedsComponent],
  imports: [
    CommonModule,
    SectionModule,
    FormsModule,
    RefineFeedModule,
    HelpMessageModule,
  ],
})
export class GenericFeedsModule {}
