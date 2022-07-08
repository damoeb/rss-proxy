import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportOptionsComponent } from './export-options.component';
import { ExportOptionsModule } from './export-options.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppSettingsService } from '../../services/app-settings.service';
import { ReplaySubject } from 'rxjs';

describe('ExportOptionsComponent', () => {
  let component: ExportOptionsComponent;
  let fixture: ComponentFixture<ExportOptionsComponent>;

  beforeEach(waitForAsync () => {
    await TestBed.configureTestingModule({
      imports: [ExportOptionsModule, HttpClientTestingModule],
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
    fixture = TestBed.createComponent(ExportOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
