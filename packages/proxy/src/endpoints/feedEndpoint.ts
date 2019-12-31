import {Express, Request, Response} from 'express';
import * as cors from 'cors';
import {Feed} from 'feed';
import logger from '../logger';
import {feedService} from '../services/feedService';
import {FeedMappingOptions, OutputType} from '@rss-proxy/core';

export const feedEndpoint = new class FeedEndpoint {
  register(app: Express) {

    app.get('/api/feeds', cors(), (request: Request, response: Response) => {
      try {
        const url = request.query.url;
        logger.info(`feed-mapping of ${url}`);
        const options: FeedMappingOptions = request.query.options ? JSON.parse(request.query.options) : {};

        if (url) {
          feedService.mapToFeed(url, options).then((feed: Feed) => {
            switch (options.output) {
              case OutputType.ATOM:
                response.setHeader('content-type', 'application/atom+xml');
                response.send(feed.atom1());
                break;
              case OutputType.RSS:
                response.setHeader('content-type', 'application/rss+xml');
                response.send(feed.rss2());
                break;
              default:
              case OutputType.JSON:
                response.setHeader('content-type', 'application/json');
                response.send(feed.json1());
                break;
            }

          }).catch((err: Error) => {
            logger.error(`Failed to proxy ${url}, cause ${err}`);
            response.send({error: err})
          });
        } else {
          response.send({error: 'param url is missing'})
        }
      } catch (e) {
        response.send({error: e})
      }
    });

  }
}
