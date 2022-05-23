import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushToMobileComponent } from './push-to-mobile.component';
import { SectionModule } from '../section/section.module';

@NgModule({
  declarations: [PushToMobileComponent],
  exports: [PushToMobileComponent],
  imports: [CommonModule, SectionModule],
})
export class PushToMobileModule {}
