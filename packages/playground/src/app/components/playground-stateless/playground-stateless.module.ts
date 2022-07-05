import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PlaygroundStatelessComponent } from './playground-stateless.component';
import { FooterModule } from '../footer/footer.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { FeedModule } from '../feed/feed.module';
import { HeaderModule } from '../header/header.module';

@NgModule({
  declarations: [PlaygroundStatelessComponent],
  exports: [PlaygroundStatelessComponent],
  entryComponents: [PlaygroundStatelessComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FooterModule,
    SpinnerModule,
    FeedModule,
    HeaderModule,
  ],
})
export class PlaygroundStatelessModule {}
