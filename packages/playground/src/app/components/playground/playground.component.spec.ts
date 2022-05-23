import { async, TestBed } from '@angular/core/testing';
import { PlaygroundComponent } from './playground.component';
import { PlaygroundModule } from './playground.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PlaygroundModule, HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();
  }));

  it('should create the component', () => {
    const fixture = TestBed.createComponent(PlaygroundComponent);
    const app = fixture.debugElement.componentInstance;

    expect(app).toBeTruthy();
  });
});
