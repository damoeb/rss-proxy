import {Express, Request, Response} from 'express';
import * as cors from 'cors';
import logger from '../logger';
import {feedService} from '../services/feedService';
import {FeedParserResult, OutputType} from '@rss-proxy/core';

export const feedEndpoint = new class FeedEndpoint {
  register(app: Express) {

    app.get('/api/feed/live', cors(), (request: Request, response: Response) => {
      try {
        const url = request.query.url;
        logger.info(`live feed-mapping of ${url}`);

        feedService.parseFeed(url, request)
          .then((feedParserResult: FeedParserResult) => {
            response.json(feedParserResult);

          })
          .catch((err: Error) => {
            logger.error(`Failed to proxy ${url}, cause ${err}`);
            response.json({error: err.toString()});
          });

      } catch (e) {
        response.json({error: e.message});
      }
    });

    app.get('/api/feed', cors(), (request: Request, response: Response) => {
      try {
        const url = request.query.url;
        logger.info(`live feed-mapping of ${url}`);

        feedService.parseFeed(url, request)
          .then((feedParserResult: FeedParserResult) => {
            response.setHeader('Content-Type', this.outputToContentType(feedParserResult.feedOutputType));
            response.send(feedParserResult.feed);

          })
          .catch((err: Error) => {
            logger.error(`Failed to proxy ${url}, cause ${err}`);
            response.json({error: err.toString()});
          });

      } catch (e) {
        response.json({error: e.message});
      }
    });

  }

  private outputToContentType(outputType: OutputType): string {
    switch (outputType) {
      case OutputType.ATOM: return 'application/atom+xml';
      case OutputType.RSS: return 'application/rss+xml';
      case OutputType.JSON:
      default:
        return 'application/json';
    }
  }
};
