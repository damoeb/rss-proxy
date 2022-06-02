import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PushOptionsComponent } from './push-options.component';
import { PushOptionsModule } from './push-options.module';

describe('PushOptionsComponent', () => {
  let component: PushOptionsComponent;
  let fixture: ComponentFixture<PushOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PushOptionsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PushOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
