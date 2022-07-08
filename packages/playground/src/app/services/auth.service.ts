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
  type: string;
  maxAge: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements CanActivate {
  private waitForToken: Promise<void>;
  constructor(
    private readonly httpClient: HttpClient,
    private readonly settings: AppSettingsService,
  ) {
    this.waitForToken = this.requestAuthTokenForWeb();
  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {
    return Promise.all([this.waitForToken, this.settings.waitForInit]).then(
      () => true,
    );
  }

  private async requestAuthTokenForWeb() {
    return firstValueFrom(this.httpClient.get<AuthResponse>('/api/auth')).then(
      (r) => {
        setTimeout(() => this.requestAuthTokenForWeb(), (r.maxAge - 10) * 1000);
      },
    );
  }
}
