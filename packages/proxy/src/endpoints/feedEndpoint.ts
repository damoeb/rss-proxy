import {Express, Request, Response} from 'express';
import * as cors from 'cors';
import logger from '../logger';
import {feedService} from '../services/feedService';
import {FeedParserOptions, OutputType, ContentResolutionType, SourceType, FeedParserResult} from '@rss-proxy/core';

export const feedEndpoint = new class FeedEndpoint {
  register(app: Express) {

    const defaultOptions: FeedParserOptions = {
      output: OutputType.JSON,
      source: SourceType.STATIC,
      preferExistingFeed: false,
      contentResolution: ContentResolutionType.STATIC
    };

    function parseFeed(url: string, request: Request) {
      const actualOptions = request.query.options ? JSON.parse(request.query.options) : {};
      const options: FeedParserOptions = {...defaultOptions, ...actualOptions};

      if (!url) {
        return Promise.reject('Param url us missing');
      }

      return feedService.mapToFeed(url, options);
    }

    app.get('/api/feed/live', cors(), (request: Request, response: Response) => {
      try {
        const url = request.query.url;
        logger.info(`live feed-mapping of ${url}`);

        parseFeed(url, request).then((feedParserResult: FeedParserResult) => {
            response.send(feedParserResult);

          }).catch((err: Error) => {
            logger.error(`Failed to proxy ${url}, cause ${err}`);
            response.send({error: err});
          });

      } catch (e) {
        response.send({error: e.message});
      }
    });

    app.get('/api/feed', cors(), (request: Request, response: Response) => {
      try {
        const url = request.query.url;
        logger.info(`live feed-mapping of ${url}`);

        parseFeed(url, request).then((feedParserResult: FeedParserResult) => {
          response.send(feedParserResult.feed);

        }).catch((err: Error) => {
          logger.error(`Failed to proxy ${url}, cause ${err}`);
          response.send({error: err});
        });

      } catch (e) {
        response.send({error: e.message});
      }
    });

  }
};
