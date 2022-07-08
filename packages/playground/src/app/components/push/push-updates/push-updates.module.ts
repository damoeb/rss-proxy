import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushUpdatesComponent } from './push-updates.component';
import { SectionModule } from '../../section/section.module';
import { PushAsWebhookModule } from '../push-as-webhook/push-as-webhook.module';
import { PushAsEmailModule } from '../push-as-email/push-as-email.module';
import { PushOptionsModule } from '../../push-options/push-options.module';

@NgModule({
  declarations: [PushUpdatesComponent],
  exports: [PushUpdatesComponent],
  imports: [
    CommonModule,
    SectionModule,
    PushAsWebhookModule,
    PushAsEmailModule,
    PushOptionsModule,
  ],
})
export class PushUpdatesModule {}
