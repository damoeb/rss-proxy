import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrerenderComponent } from './prerender.component';
import { PrerenderModule } from './prerender.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppSettingsService } from '../../services/app-settings.service';

describe('PrerenderComponent', () => {
  let component: PrerenderComponent;
  let fixture: ComponentFixture<PrerenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrerenderModule, HttpClientTestingModule],
      providers: [
        {
          provide: AppSettingsService,
          useValue: { get: () => ({ flags: {} }) },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrerenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
