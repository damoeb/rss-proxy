import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NativeOptionsComponent } from './native-options.component';
import { NativeOptionsModule } from './native-options.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppSettingsService } from '../../services/app-settings.service';

describe('NativeOptionsComponent', () => {
  let component: NativeOptionsComponent;
  let fixture: ComponentFixture<NativeOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NativeOptionsModule, HttpClientTestingModule],
      providers: [
        {
          provide: AppSettingsService,
          useValue: { get: () => ({ flags: {} }) },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NativeOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
