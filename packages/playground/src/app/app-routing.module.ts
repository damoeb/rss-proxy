import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlaygroundComponent } from './components/playground/playground.component';
import { AuthService } from './services/auth.service';

const routes: Routes = [
  { path: '', canActivate: [AuthService], component: PlaygroundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
