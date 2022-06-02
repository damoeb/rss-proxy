import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericFeedsComponent } from './generic-feeds.component';
import { SectionModule } from '../section/section.module';
import { FormsModule } from '@angular/forms';
import { RefineOptionsModule } from '../refine-options/refine-options.module';

@NgModule({
  declarations: [GenericFeedsComponent],
  exports: [GenericFeedsComponent],
  imports: [CommonModule, SectionModule, FormsModule, RefineOptionsModule],
})
export class GenericFeedsModule {}
