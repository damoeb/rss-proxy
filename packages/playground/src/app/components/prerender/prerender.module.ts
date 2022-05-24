import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrerenderComponent } from './prerender.component';
import { SectionModule } from '../section/section.module';
import { GenericFeedsModule } from '../generic-feeds/generic-feeds.module';
import { WatchPageChangeModule } from '../watch-page-change/watch-page-change.module';
import { FormsModule } from '@angular/forms';
import { SpinnerModule } from '../spinner/spinner.module';

@NgModule({
  declarations: [PrerenderComponent],
  exports: [PrerenderComponent],
  imports: [
    CommonModule,
    SectionModule,
    GenericFeedsModule,
    FormsModule,
    WatchPageChangeModule,
    SpinnerModule,
  ],
})
export class PrerenderModule {}
