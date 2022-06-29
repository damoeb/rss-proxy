import { TestBed, waitForAsync } from '@angular/core/testing';
import { PlaygroundStatelessComponent } from './playground-stateless.component';
import { PlaygroundStatelessModule } from './playground-stateless.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppSettingsService } from '../../services/app-settings.service';

describe('WelcomeComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        PlaygroundStatelessModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        {
          provide: AppSettingsService,
          useValue: { get: () => ({ flags: {}, publicUrl: '' }) },
        },
      ],
    }).compileComponents();
  }));

  it('should create the component', () => {
    const fixture = TestBed.createComponent(PlaygroundStatelessComponent);
    const app = fixture.debugElement.componentInstance;

    expect(app).toBeTruthy();
  });
});
