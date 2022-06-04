import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchPageChangeComponent } from './watch-page-change.component';
import { WatchPageChangeModule } from './watch-page-change.module';

describe('WatchPageChangeComponent', () => {
  let component: WatchPageChangeComponent;
  let fixture: ComponentFixture<WatchPageChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchPageChangeModule],
    }).compileComponents();
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
