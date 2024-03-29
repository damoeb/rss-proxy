import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PushToWebComponent } from './push-to-web.component';

describe('PushToWebComponent', () => {
  let component: PushToWebComponent;
  let fixture: ComponentFixture<PushToWebComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      declarations: [PushToWebComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PushToWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
