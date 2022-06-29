import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertFormatComponent } from './convert-format.component';
import { ConvertFormatModule } from './convert-format.module';

describe('ConvertFormatComponent', () => {
  let component: ConvertFormatComponent;
  let fixture: ComponentFixture<ConvertFormatComponent>;

  beforeEach(waitForAsync () => {
    await TestBed.configureTestingModule({
      imports: [ConvertFormatModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
