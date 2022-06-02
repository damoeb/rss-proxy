import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefineOptionsComponent } from './refine-options.component';
import { SectionModule } from '../section/section.module';
import { RefineFeedModule } from '../refine/refine-feed/refine-feed.module';

@NgModule({
  declarations: [RefineOptionsComponent],
  exports: [RefineOptionsComponent],
  imports: [CommonModule, SectionModule, RefineFeedModule],
})
export class RefineOptionsModule {}
