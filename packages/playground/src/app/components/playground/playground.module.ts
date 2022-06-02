import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PlaygroundComponent } from './playground.component';
import { GenericFeedsModule } from '../generic-feeds/generic-feeds.module';
import { NativeFeedsModule } from '../native-feeds/native-feeds.module';
import { OptionsModule } from '../options/options.module';
import { FooterModule } from '../footer/footer.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { SearchModule } from '../search/search.module';

@NgModule({
  declarations: [PlaygroundComponent],
  exports: [PlaygroundComponent],
  entryComponents: [PlaygroundComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    GenericFeedsModule,
    NativeFeedsModule,
    OptionsModule,
    FooterModule,
    SpinnerModule,
    SearchModule,
  ],
})
export class PlaygroundModule {}
