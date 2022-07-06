import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { build } from '../../../environments/build';
import {
  AppSettingsService,
  FeatureFlags,
} from '../../services/app-settings.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {
  buildInfo: { date: string; version: string; revision: string };
  flags: FeatureFlags;
  showHelp: boolean;
  @Input()
  showCredits: boolean;

  constructor(
    private readonly settings: AppSettingsService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  async ngOnInit(): Promise<void> {
    this.buildInfo = build;
    this.flags = this.settings.get().flags;
    this.changeDetectorRef.detectChanges();

    this.settings.watchShowHelp().subscribe((showHelp) => {
      this.showHelp = showHelp;
      this.changeDetectorRef.detectChanges();
    });
  }

  formatDate(date: string) {
    return date;
  }

  help() {
    this.settings.setShowHelp(true);
  }
}
