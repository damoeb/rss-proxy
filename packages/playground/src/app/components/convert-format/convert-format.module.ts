import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConvertFormatComponent } from './convert-format.component';
import { SectionModule } from '../section/section.module';
import { FeedUrlModule } from '../feed-url/feed-url.module';

@NgModule({
  declarations: [ConvertFormatComponent],
  exports: [ConvertFormatComponent],
  imports: [CommonModule, SectionModule, FeedUrlModule],
})
export class ConvertFormatModule {}
