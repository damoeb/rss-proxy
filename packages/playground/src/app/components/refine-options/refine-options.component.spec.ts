import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefineOptionsComponent } from './native-options.component';
import { RefineOptionsModule } from './native-options.module';

describe('NativeOptionsComponent', () => {
  let component: RefineOptionsComponent;
  let fixture: ComponentFixture<RefineOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefineOptionsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefineOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
