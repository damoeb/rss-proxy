import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsComponent } from './options.component';
import { OptionsModule } from './options.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppSettingsService } from '../../services/app-settings.service';
import { ReplaySubject } from 'rxjs';

describe('OptionsComponent', () => {
  let component: OptionsComponent;
  let fixture: ComponentFixture<OptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionsModule, HttpClientTestingModule],
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
    fixture = TestBed.createComponent(OptionsComponent);
    component = fixture.componentInstance;
    component.response = {
      results: { nativeFeeds: [], genericFeedRules: [] },
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
