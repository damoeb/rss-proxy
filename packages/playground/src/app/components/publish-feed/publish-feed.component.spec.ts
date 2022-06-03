import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishFeedComponent } from './publish-feed.component';

describe('PublishFeedComponent', () => {
  let component: PublishFeedComponent;
  let fixture: ComponentFixture<PublishFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublishFeedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
