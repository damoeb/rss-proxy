import {Express, Request, Response} from 'express';
import logger from '../logger';
import * as cors from 'cors';
import { feedService } from '../services/feedService';
import {Feed} from 'feed';

export interface FeedMappingOptions {

}

export const feedEndpoint = new class FeedEndpoint {
  register(app: Express) {

    app.get('/api/feeds', cors(), (request: Request, response: Response) => {
      try {
        const url = request.query.url;
        logger.info(`feed-mapping of ${url}`);
        const options: FeedMappingOptions = request.body;
        if (url) {
          feedService.mapToFeed(url, options).then((feed: Feed) => {
            response.setHeader('content-type', 'application/json');

            response.send(feed.json1());

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
