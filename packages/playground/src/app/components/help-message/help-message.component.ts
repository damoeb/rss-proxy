import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { AppSettingsService } from '../../services/app-settings.service';

@Component({
  selector: 'app-help-message',
  templateUrl: './help-message.component.html',
  styleUrls: ['./help-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpMessageComponent implements OnInit {
  show: boolean;
  constructor(
    private readonly appSettings: AppSettingsService,
    private readonly changeRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.appSettings.watchShowHelp().subscribe((showHelp) => {
      this.show = showHelp;
      this.changeRef.detectChanges();
    });
  }

  hide() {
    this.show = false;
    this.appSettings.setShowHelp(false);
  }
}
