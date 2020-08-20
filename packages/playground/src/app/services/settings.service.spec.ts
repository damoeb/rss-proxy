import { TestBed } from '@angular/core/testing';

import { SettingsService } from './settings.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('SettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ]
  }));

  it('should be created', () => {
    const service: SettingsService = TestBed.get(SettingsService);
    expect(service).toBeTruthy();
  });
});
