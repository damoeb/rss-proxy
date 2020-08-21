import { TestBed, async } from '@angular/core/testing';
import { PlaygroundComponent } from './playground.component';
import {PlaygroundModule} from './playground.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        PlaygroundModule,
        HttpClientTestingModule
      ]
    }).compileComponents();
  }));

  it('should create the component', () => {
    const fixture = TestBed.createComponent(PlaygroundComponent);
    const app = fixture.debugElement.componentInstance;

    expect(app).toBeTruthy();
  });

});
