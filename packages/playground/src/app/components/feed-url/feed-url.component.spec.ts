import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedUrlComponent } from './feed-url.component';
import { FeedUrlModule } from './feed-url.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppSettingsService } from '../../services/app-settings.service';
import { ReplaySubject } from 'rxjs';

describe('FeedUrlComponent', () => {
  let component: FeedUrlComponent;
  let fixture: ComponentFixture<FeedUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedUrlModule, HttpClientTestingModule],
      providers: [
        {
          provide: AppSettingsService,
          useValue: {
            get: () => ({ flags: {} }),
            watchShowHelp: () => new ReplaySubject().asObservable(),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
