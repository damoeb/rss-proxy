import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NativeFeedsComponent } from './native-feeds.component';

describe('NativeFeedsComponent', () => {
  let component: NativeFeedsComponent;
  let fixture: ComponentFixture<NativeFeedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NativeFeedsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NativeFeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
