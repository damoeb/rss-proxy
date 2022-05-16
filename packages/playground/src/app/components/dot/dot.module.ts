import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotComponent } from './dot.component';



@NgModule({
  declarations: [DotComponent],
  exports: [DotComponent],
  imports: [
    CommonModule
  ]
})
export class DotModule { }
