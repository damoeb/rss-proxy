import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchPageChangeComponent } from './watch-page-change.component';

describe('WatchPageChangeComponent', () => {
  let component: WatchPageChangeComponent;
  let fixture: ComponentFixture<WatchPageChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WatchPageChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchPageChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
