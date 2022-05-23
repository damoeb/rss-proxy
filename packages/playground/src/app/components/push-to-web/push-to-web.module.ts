import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushToWebComponent } from './push-to-web.component';
import { SectionModule } from '../section/section.module';

@NgModule({
  declarations: [PushToWebComponent],
  exports: [PushToWebComponent],
  imports: [CommonModule, SectionModule],
})
export class PushToWebModule {}
