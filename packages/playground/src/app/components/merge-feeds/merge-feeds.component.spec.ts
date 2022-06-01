import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeFeedsComponent } from './merge-feeds.component';
import { MergeFeedsModule } from './merge-feeds.module';

describe('MergeFeedsComponent', () => {
  let component: MergeFeedsComponent;
  let fixture: ComponentFixture<MergeFeedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MergeFeedsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeFeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
