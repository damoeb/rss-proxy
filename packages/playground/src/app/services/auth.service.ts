import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { SettingsService } from './settings.service';

interface AuthResponse {
  token: string;
  user: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements CanActivate {
  private token: string;
  private waitForToken: Promise<void>;
  constructor(
    private readonly httpClient: HttpClient,
    private readonly settings: SettingsService,
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
        this.token = r.token;
      },
    );
  }

  getToken() {
    return this.token;
  }
}
