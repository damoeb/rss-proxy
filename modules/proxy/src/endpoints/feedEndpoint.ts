import {Express, Request, Response} from 'express';
import logger from '../logger';
import * as cors from 'cors';
import {feedService, MappedFeedResponse} from '../services/feedService';

export interface FeedMappingOptions {

}

export const feedEndpoint = new class FeedEndpoint {
  register(app: Express) {

    app.get('/api/feeds', cors(), (request: Request, response: Response) => {
      const url = request.query.url;
      logger.info(`feed-mapping of ${url}`);
      const options: FeedMappingOptions = request.body;
      if (url) {
        feedService.mapToFeed(url).then((mappedFeedResponse: MappedFeedResponse) => {
          // response.setHeader('content-type', mappedFeedResponse.response.headers["content-type"]);

          response.send(mappedFeedResponse);

        }).catch((err: Error) => {
          logger.error(`Failed to proxy ${url}, cause ${err}`);
          response.send({error: err})
        });
      } else {
        response.send({error: 'param url is missing'})
      }
    });

  }
}
