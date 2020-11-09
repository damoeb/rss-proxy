import Analytics from 'analytics-node';
import {Request} from 'express';
import {config} from '../config';

export const analyticsService =  new class AnalyticsService {
  private analytics: Analytics;
  constructor() {
    if (config.analytics.enabled) {
      this.analytics = new Analytics(config.analytics.segmentKey);
    }
  }

  public track(event: string, request: Request, properties: object) {
    if (this.active()) {
      this.analytics.track({
        event,
        properties,
        context: {
          ip: request.ip
        },
        anonymousId: request.ip,
        timestamp: new Date()
      });
    }
  }

  public active(): boolean {
    return !!this.analytics;
  }
};
