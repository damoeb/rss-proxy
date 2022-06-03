import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedUrlComponent } from './feed-url.component';

describe('FeedUrlComponent', () => {
  let component: FeedUrlComponent;
  let fixture: ComponentFixture<FeedUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedUrlComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
