import { Component, Input, OnInit } from '@angular/core';
import { NativeFeedWithParams } from '../../services/feed.service';

@Component({
  selector: 'app-native-options',
  templateUrl: './native-options.component.html',
  styleUrls: ['./native-options.component.scss'],
})
export class NativeOptionsComponent implements OnInit {
  hasChosen: boolean;
  convertFormat: boolean;
  merge: boolean;
  refine: boolean;
  pushUpdates: boolean;

  @Input()
  nativeFeed: NativeFeedWithParams;

  constructor() {}

  ngOnInit(): void {}

  private use(fn: () => void) {
    this.reset();
    fn();
    this.hasChosen = true;
  }

  private reset() {
    this.convertFormat = null;
    this.merge = null;
    this.refine = null;
    this.pushUpdates = null;
  }

  useConvertFormat() {
    this.use(() => {
      this.convertFormat = true;
    });
  }

  useMerge() {
    this.use(() => {
      this.merge = true;
    });
  }

  useRefine() {
    this.use(() => {
      this.refine = true;
    });
  }

  usePushUpdate() {
    this.use(() => {
      this.pushUpdates = true;
    });
  }
}
