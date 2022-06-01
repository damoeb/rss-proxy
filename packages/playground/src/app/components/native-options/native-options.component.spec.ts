import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NativeOptionsComponent } from './native-options.component';
import { NativeOptionsModule } from './native-options.module';

describe('NativeOptionsComponent', () => {
  let component: NativeOptionsComponent;
  let fixture: ComponentFixture<NativeOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NativeOptionsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NativeOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
