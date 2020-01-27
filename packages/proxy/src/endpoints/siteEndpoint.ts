import {Express, Request, Response} from 'express';
import {siteService} from '../services/siteService';
import logger from '../logger';
import * as cors from 'cors';

export const siteEndpoint = new class ProxyEndpoint {
  register(app: Express) {

    app.get('/api/site', cors(), (request: Request, response: Response) => {
      const url = request.query.url;
      logger.info(`deep-site ${url}`);
      if (url) {
        siteService.analyze(url).then(result => {
          response.json(result);
        }).catch(err => {
          logger.error(`Failed to proxy ${url}, cause ${err}`);
          response.json({error: err})
        });
      } else {
        response.json({error: 'param url is missing'})
      }
    });

  }
}
