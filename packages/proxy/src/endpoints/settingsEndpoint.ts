import {Express, Request, Response} from 'express';

export const settingsEndpoint = new class SettingsEndpoint {
  register(app: Express) {

    app.get('/api/settings', (request: Request, response: Response) => {
      response.json({message: ''});
    });
  }

};
