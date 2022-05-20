import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefineFeedComponent } from './refine-feed.component';

describe('RefineFeedComponent', () => {
  let component: RefineFeedComponent;
  let fixture: ComponentFixture<RefineFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefineFeedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefineFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
