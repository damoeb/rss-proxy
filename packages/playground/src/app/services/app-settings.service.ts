import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Field {
  name: string;
  type: string;
}
export interface AppAnnouncement {
  id: string;
  fields: Field[];
  title: string;
  body: string;
  submittable: boolean;
  showIf: '';
}
export interface FeatureFlags {
  canPrerender: boolean;
  willExtractFulltext: boolean;
  canMail: boolean;
  canPush: boolean;
  stateless: boolean;
}
export interface AppSettings {
  flags: FeatureFlags;
  announcements: AppAnnouncement[];
  webToFeedVersion: boolean;
  publicUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppSettingsService {
  private appSettings: AppSettings;
  public readonly waitForInit: Promise<void>;

  constructor(private readonly httpClient: HttpClient) {
    this.waitForInit = this.init();
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
