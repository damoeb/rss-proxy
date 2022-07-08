import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PushToMobileComponent } from './push-to-mobile.component';

describe('PushToMobileComponent', () => {
  let component: PushToMobileComponent;
  let fixture: ComponentFixture<PushToMobileComponent>;

  beforeEach(waitForAsync () => {
    await TestBed.configureTestingModule({
      declarations: [PushToMobileComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PushToMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
