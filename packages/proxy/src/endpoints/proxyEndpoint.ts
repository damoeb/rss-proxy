import {Express, Request, Response} from 'express';
import {proxyService} from '../services/proxyService';
import logger from '../logger';

export const proxyEndpoint = new class ProxyEndpoint {
  register(app: Express) {

    app.get('/api/dynamic', (request: Request, response: Response) => {
      const startTime = new Date().getTime();
      const url = request.query.url as string;
      logger.info(`Fetching ${url}`);
      proxyService.getProxiedDynamicHtml(url).then(proxyResponse => {
        logger.info(`dyn dl took ${new Date().getTime() - startTime} ${url}`);
        response.status(200);
        response.send(proxyResponse);
      }).catch(err => {
        response.status(500);
        response.json({error: true, message: err});
        response.end();
      });
    });
  }
};
