import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushUpdatesComponent } from './push-updates.component';
import {SectionModule} from '../section/section.module';



@NgModule({
    declarations: [
        PushUpdatesComponent
    ],
    exports: [
        PushUpdatesComponent
    ],
  imports: [
    CommonModule,
    SectionModule
  ]
})
export class PushUpdatesModule { }
