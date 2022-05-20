import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericFeedsComponent } from './generic-feeds.component';

describe('GenericFeedsComponent', () => {
  let component: GenericFeedsComponent;
  let fixture: ComponentFixture<GenericFeedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericFeedsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericFeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
