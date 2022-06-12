import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AppSettingsService } from './app-settings.service';

interface AuthResponse {
  user: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements CanActivate {
  private waitForToken: Promise<void>;
  private user: string;
  constructor(
    private readonly httpClient: HttpClient,
    private readonly settings: AppSettingsService,
  ) {
    this.waitForToken = this.requestAuthTokenForAnonymous();
  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {
    return Promise.all([this.waitForToken, this.settings.waitForInit]).then(
      () => true,
    );
  }

  private async requestAuthTokenForAnonymous() {
    return firstValueFrom(this.httpClient.get<AuthResponse>('/api/auth')).then(
      (r) => {
        this.user = r.user;
      },
    );
  }
}
