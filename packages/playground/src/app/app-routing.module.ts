import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PlaygroundComponent} from './components/playground/playground.component';

const routes: Routes = [
  {path: '', component: PlaygroundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
