import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushAsNotificationComponent } from './push-as-notification.component';
import { SectionModule } from '../section/section.module';
import { PushToWebModule } from '../push-to-web/push-to-web.module';
import { PushToMobileModule } from '../push-to-mobile/push-to-mobile.module';

@NgModule({
  declarations: [PushAsNotificationComponent],
  exports: [PushAsNotificationComponent],
  imports: [CommonModule, SectionModule, PushToWebModule, PushToMobileModule],
})
export class PushAsNotificationModule {}
