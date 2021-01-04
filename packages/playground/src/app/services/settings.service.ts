import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  // tslint:disable-next-line:variable-name
  private _settings: Promise<any>;

  constructor(httpClient: HttpClient) {
    this._settings = httpClient.get(`api/settings`).toPromise();
  }

  public settings(): Promise<any> {
    return this._settings;
  }

}
