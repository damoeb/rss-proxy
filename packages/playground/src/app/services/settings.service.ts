import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface AppSettings {
  canPrerender: boolean;
  canExtractFulltext: boolean;
  canMail: boolean;
  canPush: boolean;
  stateless: boolean;
  webToFeedVersion: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private appSettings: AppSettings;

  constructor(private readonly httpClient: HttpClient) {
    this.init();
  }
  private async init() {
    this.appSettings = await firstValueFrom(
      this.httpClient.get<AppSettings>(`api/settings`),
    );
  }

  get(): AppSettings {
    return this.appSettings;
  }
}
