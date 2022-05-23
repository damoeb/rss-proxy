import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NativeFeedsComponent } from './native-feeds.component';
import { SectionModule } from '../section/section.module';
import { RefineFeedModule } from '../refine-feed/refine-feed.module';

@NgModule({
  declarations: [NativeFeedsComponent],
  exports: [NativeFeedsComponent],
  imports: [CommonModule, SectionModule, RefineFeedModule],
})
export class NativeFeedsModule {}
