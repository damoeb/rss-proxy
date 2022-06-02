import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushOptionsComponent } from './push-options.component';
import { SectionModule } from '../section/section.module';
import { PushToWebModule } from '../push/push-to-web/push-to-web.module';
import { PushToMobileModule } from '../push/push-to-mobile/push-to-mobile.module';

@NgModule({
  declarations: [PushOptionsComponent],
  exports: [PushOptionsComponent],
  imports: [CommonModule, SectionModule, PushToWebModule, PushToMobileModule],
})
export class PushOptionsModule {}
