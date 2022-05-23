import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushAsEmailComponent } from './push-as-email.component';
import { SectionModule } from '../section/section.module';

@NgModule({
  declarations: [PushAsEmailComponent],
  exports: [PushAsEmailComponent],
  imports: [CommonModule, SectionModule],
})
export class PushAsEmailModule {}
