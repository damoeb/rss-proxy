import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrerenderComponent } from './prerender.component';

describe('PrerenderComponent', () => {
  let component: PrerenderComponent;
  let fixture: ComponentFixture<PrerenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrerenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrerenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
