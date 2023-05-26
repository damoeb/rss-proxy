import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, ReplaySubject } from 'rxjs';

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

export interface ApiUrls {
  webToFeed: string;
  host: string;
  transformFeed: string;
  discoverFeeds: string;
}

export interface AppSettings {
  flags: FeatureFlags;
  urls: ApiUrls;
  announcements: AppAnnouncement[];
  webToFeedVersion: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AppSettingsService {
  private appSettings: AppSettings;
  public readonly waitForInit: Promise<void>;
  private showHelp: boolean;
  private helpSubject = new ReplaySubject<boolean>();

  constructor(private readonly httpClient: HttpClient) {
    this.waitForInit = this.init();
  }
  private async init() {
    this.appSettings = await firstValueFrom(
      this.httpClient.get<AppSettings>(`api/legacy/settings`),
    );
  }

  get(): AppSettings {
    return this.appSettings;
  }

  watchShowHelp(): Observable<boolean> {
    return this.helpSubject.asObservable();
  }

  setShowHelp(change: boolean): void {
    this.showHelp = change;
    this.helpSubject.next(change);
  }
}
