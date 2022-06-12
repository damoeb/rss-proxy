import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpMessageComponent } from './help-message.component';

describe('HelpMessageComponent', () => {
  let component: HelpMessageComponent;
  let fixture: ComponentFixture<HelpMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpMessageComponent ]
    })
    .compileComponents();
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
