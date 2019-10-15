import {Express, Request, Response} from 'express';
import proxyService from "../services/proxyService";
import httpUtil from "../httpUtil";
import logger from "../logger";

export default new class ProxyEndpoint {
  register(app: Express) {

    app.get('/api/proxy', (request: Request, response: Response) => {
      const url = request.query.url;
      logger.info(`proxy ${url}`);
      if (url) {
        proxyService.proxy(url).then(proxyResponse => {
          response.setHeader('content-type', proxyResponse.response.headers["content-type"]);
          response.setHeader('host', 'http://telepolis.de');
          response.send(proxyResponse.body);
        }).catch(err => {
          logger.error(`Failed to proxy ${url}, cause ${err}`);
          response.send({error: err})
        });
      } else {
        response.send({error: 'param url is missing'})
      }
    });

  }
}
