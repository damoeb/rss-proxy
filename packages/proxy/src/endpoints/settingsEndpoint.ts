import {Express, Request, Response} from 'express';
import {config} from '../config';

export const settingsEndpoint = new class SettingsEndpoint {
  register(app: Express) {

    app.get('/api/settings', (request: Request, response: Response) => {
      response.json({
        jsSupport: config.enableJavaScript,
        showFooterBanner: config.env.endsWith('deploy'),
        // todo mag externalize as env var
        footerMessage: 'Hi there, if you any question contact me via <a href="https://twitter.com/damoeb" target="_blank">@damoeb</a>'
      });
    });
  }
};
