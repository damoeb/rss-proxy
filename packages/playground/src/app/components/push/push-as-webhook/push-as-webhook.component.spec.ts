import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PushAsWebhookComponent } from './push-as-webhook.component';

describe('PushAsWebhookComponent', () => {
  let component: PushAsWebhookComponent;
  let fixture: ComponentFixture<PushAsWebhookComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      declarations: [PushAsWebhookComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PushAsWebhookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
