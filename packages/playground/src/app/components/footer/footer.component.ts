import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {build} from '../../../environments/build';
import {ServerSettings, SettingsService} from '../../services/settings.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit {
  buildInfo: { date: string; version: string; revision: string };
  serverSettings: ServerSettings;

  constructor(private readonly settings: SettingsService,
              private readonly changeDetectorRef: ChangeDetectorRef) { }

  async ngOnInit(): Promise<void> {
    this.buildInfo = build;
    this.serverSettings = await this.settings.serverSettings();
    this.changeDetectorRef.detectChanges();
  }

  formatDate(date: string) {
    return date;
  }
}
