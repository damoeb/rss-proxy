import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NativeOptionsComponent } from './native-options.component';
import { SectionModule } from '../section/section.module';
import { ExportOptionsModule } from '../export-options/export-options.module';
import { RefineFeedModule } from '../refine-feed/refine-feed.module';
import { HelpMessageModule } from '../help-message/help-message.module';

@NgModule({
  declarations: [NativeOptionsComponent],
  exports: [NativeOptionsComponent],
  imports: [
    CommonModule,
    SectionModule,
    ExportOptionsModule,
    RefineFeedModule,
    HelpMessageModule,
  ],
})
export class NativeOptionsModule {}
