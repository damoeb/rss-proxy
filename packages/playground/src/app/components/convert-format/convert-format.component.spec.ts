import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertFormatComponent } from './convert-format.component';

describe('ConvertFormatComponent', () => {
  let component: ConvertFormatComponent;
  let fixture: ComponentFixture<ConvertFormatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConvertFormatComponent],
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
