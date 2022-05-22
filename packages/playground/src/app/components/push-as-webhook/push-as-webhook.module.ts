import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushAsWebhookComponent } from './push-as-webhook.component';
import {SectionModule} from '../section/section.module';



@NgModule({
  declarations: [
    PushAsWebhookComponent
  ],
  exports: [
    PushAsWebhookComponent
  ],
  imports: [
    CommonModule,
    SectionModule
  ]
})
export class PushAsWebhookModule { }
