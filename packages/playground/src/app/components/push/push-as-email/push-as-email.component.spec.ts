import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PushAsEmailComponent } from './push-as-email.component';

describe('PushAsEmailComponent', () => {
  let component: PushAsEmailComponent;
  let fixture: ComponentFixture<PushAsEmailComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      declarations: [PushAsEmailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PushAsEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
