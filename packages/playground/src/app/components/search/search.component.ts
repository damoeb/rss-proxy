import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
} from '@angular/core';
import { debounce } from 'lodash';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  @Input()
  url: string;
  @Input()
  placeholder: string;
  // tslint:disable-next-line:no-output-native
  @Output()
  submitUrl = new EventEmitter<string>();
  // tslint:disable-next-line:no-output-native
  @Output()
  change = new EventEmitter<string>();

  isLoading = false;
  @Input()
  showSubmit = true;
  @Input()
  buttonText = 'Search';

  constructor() {
    this.callTrigger = debounce(this.callTrigger, 50);
  }

  callTrigger() {
    console.log('callTrigger');
    this.submitUrl.emit(this.url);
  }

  callChange(url: string) {
    this.change.emit(url);
  }
}
