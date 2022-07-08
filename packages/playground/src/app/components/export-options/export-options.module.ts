import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportOptionsComponent } from './export-options.component';
import { SectionModule } from '../section/section.module';
import { PushUpdatesModule } from '../push/push-updates/push-updates.module';
import { ConvertFormatModule } from '../convert-format/convert-format.module';

@NgModule({
  declarations: [ExportOptionsComponent],
  exports: [ExportOptionsComponent],
  imports: [
    CommonModule,
    SectionModule,
    PushUpdatesModule,
    ConvertFormatModule,
  ],
})
export class ExportOptionsModule {}
