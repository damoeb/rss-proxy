import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PushUpdatesComponent } from './push-updates.component';

describe('PushUpdatesComponent', () => {
  let component: PushUpdatesComponent;
  let fixture: ComponentFixture<PushUpdatesComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      declarations: [PushUpdatesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PushUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
