import {Express, Request, Response} from 'express';
import cors from 'cors';
import logger from '../logger';
import {FeedParserError, feedService, GetResponse} from '../services/feedService';
import {FeedParserResult, SimpleFeedResult, OutputType} from '@rss-proxy/core';
import {analyticsService} from '../services/analyticsService';
import {proxyService} from '../services/proxyService';
import httpUtil from '../httpUtil';

export const proxyEndpoint = new class ProxyEndpoint {
  register(app: Express) {

    app.get('/api/proxy', (request: Request, response: Response) => {
      proxyService.getProxiedHtml(request.query.url as string).then(proxyResponse => {
        response.status(200)
        // proxyResponse.headers.forEach(header => {
          // response.setHeader()
        // })
        response.send(proxyResponse.body)
      }).catch(err => {
        response.status(500)
        response.json({error: true, message: err})
        response.end();
      });
    });
  }
};
