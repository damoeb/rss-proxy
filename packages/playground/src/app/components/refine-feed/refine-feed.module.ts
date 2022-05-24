import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefineFeedComponent } from './refine-feed.component';
import { SectionModule } from '../section/section.module';
import { ConvertFormatModule } from '../convert-format/convert-format.module';
import { PushUpdatesModule } from '../push-updates/push-updates.module';
import { FormsModule } from '@angular/forms';
import { FeedModule } from '../feed/feed.module';
import { SpinnerModule } from '../spinner/spinner.module';

@NgModule({
  declarations: [RefineFeedComponent],
  exports: [RefineFeedComponent],
  imports: [
    CommonModule,
    SectionModule,
    FormsModule,
    ConvertFormatModule,
    PushUpdatesModule,
    FeedModule,
    SpinnerModule,
  ],
})
export class RefineFeedModule {}
