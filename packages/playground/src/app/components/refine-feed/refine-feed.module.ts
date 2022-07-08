import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefineFeedComponent } from './refine-feed.component';
import { FormsModule } from '@angular/forms';
import { SectionModule } from '../section/section.module';
import { FeedModule } from '../feed/feed.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { ExportOptionsModule } from '../export-options/export-options.module';
import { HelpMessageModule } from '../help-message/help-message.module';

@NgModule({
  declarations: [RefineFeedComponent],
  exports: [RefineFeedComponent],
  imports: [
    CommonModule,
    SectionModule,
    FormsModule,
    FeedModule,
    SpinnerModule,
    ExportOptionsModule,
    HelpMessageModule,
  ],
})
export class RefineFeedModule {}
