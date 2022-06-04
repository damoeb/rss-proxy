import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeFeedsComponent } from './merge-feeds.component';
import { MergeFeedsModule } from './merge-feeds.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppSettingsService } from '../../services/app-settings.service';

describe('MergeFeedsComponent', () => {
  let component: MergeFeedsComponent;
  let fixture: ComponentFixture<MergeFeedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MergeFeedsModule, HttpClientTestingModule],
      providers: [
        {
          provide: AppSettingsService,
          useValue: { get: () => ({ flags: {} }) },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeFeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
