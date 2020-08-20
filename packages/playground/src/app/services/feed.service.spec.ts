import { TestBed } from '@angular/core/testing';

import { FeedService } from './feed.service';
import {PlaygroundModule} from '../components/playground/playground.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('FeedService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ]
  }));

  it('should be created', () => {
    const service: FeedService = TestBed.get(FeedService);
    expect(service).toBeTruthy();
  });
});
