import { TestBed } from '@angular/core/testing';

import { FeedService } from './feed.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { AppSettingsService } from './app-settings.service';

describe('AppSettingsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    }),
  );

  it('should be created', () => {
    const service: AppSettingsService = TestBed.inject(AppSettingsService);
    expect(service).toBeTruthy();
  });
});
