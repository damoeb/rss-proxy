import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NativeOptionsComponent } from './native-options.component';
import { NativeOptionsModule } from './native-options.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppSettingsService } from '../../services/app-settings.service';
import { ReplaySubject } from 'rxjs';

describe('NativeOptionsComponent', () => {
  let component: NativeOptionsComponent;
  let fixture: ComponentFixture<NativeOptionsComponent>;

  beforeEach(waitForAsync () => {
    await TestBed.configureTestingModule({
      imports: [NativeOptionsModule, HttpClientTestingModule],
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
    fixture = TestBed.createComponent(NativeOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
