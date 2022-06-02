import { Component, Input, OnInit } from '@angular/core';
import { NativeFeedWithParams } from '../../services/feed.service';
import { AppSettingsService } from '../../services/app-settings.service';

@Component({
  selector: 'app-native-options',
  templateUrl: './native-options.component.html',
  styleUrls: ['./native-options.component.scss'],
})
export class NativeOptionsComponent implements OnInit {
  hasChosen: boolean;
  export: boolean;
  merge: boolean;
  refine: boolean;

  @Input()
  nativeFeed: NativeFeedWithParams;
  stateless: boolean;

  constructor(private settings: AppSettingsService) {}

  ngOnInit(): void {
    this.stateless = this.settings.get().stateless;
  }

  private use(fn: () => void) {
    this.reset();
    fn();
    this.hasChosen = true;
  }

  private reset() {
    this.export = null;
    this.merge = null;
    this.refine = null;
  }

  useExport() {
    this.use(() => {
      this.export = true;
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
}
