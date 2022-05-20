import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrerenderComponent } from './prerender.component';
import {SectionModule} from '../section/section.module';



@NgModule({
    declarations: [
        PrerenderComponent
    ],
    exports: [
        PrerenderComponent
    ],
  imports: [
    CommonModule,
    SectionModule
  ]
})
export class PrerenderModule { }
