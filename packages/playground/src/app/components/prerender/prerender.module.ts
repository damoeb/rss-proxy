import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrerenderComponent } from './prerender.component';
import { SectionModule } from '../section/section.module';
import { GenericFeedsModule } from '../generic-feeds/generic-feeds.module';
import { WatchPageChangeModule } from '../watch-page-change/watch-page-change.module';

@NgModule({
  declarations: [PrerenderComponent],
  exports: [PrerenderComponent],
  imports: [
    CommonModule,
    SectionModule,
    GenericFeedsModule,
    WatchPageChangeModule,
  ],
})
export class PrerenderModule {}
