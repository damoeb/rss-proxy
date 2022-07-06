import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NativeFeedsComponent } from './native-feeds.component';
import { NativeFeedsModule } from './native-feeds.module';

describe('NativeFeedsComponent', () => {
  let component: NativeFeedsComponent;
  let fixture: ComponentFixture<NativeFeedsComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [NativeFeedsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NativeFeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
