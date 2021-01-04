import {Express, Request, Response} from 'express';
import {proxyService} from '../services/proxyService';

export const proxyEndpoint = new class ProxyEndpoint {
  register(app: Express) {

    app.get('/api/dynamic', (request: Request, response: Response) => {
      proxyService.getProxiedDynamicHtml(request.query.url as string).then(proxyResponse => {
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
