import { TestBed } from '@angular/core/testing';

import { FeedService } from './feed.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppSettingsService } from './app-settings.service';

describe('FeedService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: AppSettingsService,
          useValue: { get: () => ({ publicUrl: '' }) },
        },
      ],
    }),
  );

  it('should be created', () => {
    const service = TestBed.inject<FeedService>(FeedService);
    expect(service).toBeTruthy();
  });
});
