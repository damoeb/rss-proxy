import { FeedWizardParams } from './services/feed.service';
import { clone } from 'lodash';

export class WizardComponent {
  copy<T extends FeedWizardParams>(feedWithParams: T): T {
    return clone(feedWithParams);
  }
}
