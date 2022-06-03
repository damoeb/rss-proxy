import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedUrlComponent } from './feed-url.component';
import { SectionModule } from '../section/section.module';
import { FormsModule } from '@angular/forms';
import { SpinnerModule } from '../spinner/spinner.module';

@NgModule({
  declarations: [FeedUrlComponent],
  imports: [CommonModule, FormsModule, SectionModule, SpinnerModule],
  exports: [FeedUrlComponent],
})
export class FeedUrlModule {}
