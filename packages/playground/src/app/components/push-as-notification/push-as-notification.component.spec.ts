import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PushAsNotificationComponent } from './push-as-notification.component';

describe('PushAsNotificationComponent', () => {
  let component: PushAsNotificationComponent;
  let fixture: ComponentFixture<PushAsNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PushAsNotificationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PushAsNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
