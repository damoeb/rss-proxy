import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NativeFeedsComponent } from './native-feeds.component';
import { SectionModule } from '../section/section.module';
import { NativeOptionsModule } from '../native-options/native-options.module';

@NgModule({
  declarations: [NativeFeedsComponent],
  exports: [NativeFeedsComponent],
  imports: [CommonModule, SectionModule, NativeOptionsModule],
})
export class NativeFeedsModule {}
