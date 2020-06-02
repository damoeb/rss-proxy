import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(httpClient: HttpClient) {
    httpClient.get(`${this.getApiBase()}api/settings`).subscribe(settings => {
      console.log(settings);
    });
  }

  private getApiBase() {
    return environment.apiBase || location.href;
  }

}
