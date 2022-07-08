import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpMessageComponent } from './help-message.component';

@NgModule({
  declarations: [HelpMessageComponent],
  exports: [HelpMessageComponent],
  imports: [CommonModule],
})
export class HelpMessageModule {}
