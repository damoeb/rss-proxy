import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthService } from './services/auth.service';
import { PlaygroundStatelessComponent } from './components/playground-stateless/playground-stateless.component';

const routes: Routes = [
  // { path: '', canActivate: [AuthService], component: PlaygroundComponent },
  {
    path: '',
    canActivate: [AuthService],
    component: PlaygroundStatelessComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
