import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpMessageComponent } from './help-message.component';
import { HelpMessageModule } from './help-message.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HelpMessageComponent', () => {
  let component: HelpMessageComponent;
  let fixture: ComponentFixture<HelpMessageComponent>;

  beforeEach(waitForAsync () => {
    await TestBed.configureTestingModule({
      imports: [HelpMessageModule, HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
