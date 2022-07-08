import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WatchPageChangeComponent } from './watch-page-change.component';
import { SectionModule } from '../section/section.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [WatchPageChangeComponent],
  exports: [WatchPageChangeComponent],
  imports: [CommonModule, SectionModule, FormsModule],
})
export class WatchPageChangeModule {}
