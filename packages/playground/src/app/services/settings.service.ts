import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface ServerSettings {
  jsSupport: boolean;
  stateless: boolean;
  webToFeedVersion: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  // tslint:disable-next-line:variable-name
  private _serverSettings: Promise<ServerSettings>;

  constructor(private readonly httpClient: HttpClient) {
    this._serverSettings = firstValueFrom(
      httpClient.get<ServerSettings>(`api/settings`),
    );
  }

  public serverSettings(): Promise<ServerSettings> {
    return this._serverSettings;
  }
}
