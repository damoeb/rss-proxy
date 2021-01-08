import {Express, Request, Response} from 'express';
import cors from 'cors';
import iconv from 'iconv-lite';

import {FeedParserOptions, FeedParserResult, OutputType, SimpleFeedResult} from '@rss-proxy/core';
import logger from '../logger';
import {FeedParserError, feedService, GetResponse} from '../services/feedService';

export const feedEndpoint = new class FeedEndpoint {
  private static returnErrorFeed(url: string, message: string, options: FeedParserOptions, response: Response) {
    const errorFeed = feedService.mapErrorToFeed(url, message, options);
    response.setHeader('Content-Type', 'application/atom+xml');
    response.write(errorFeed);
    response.end();
  }

  private static outputToContentType(outputType: OutputType): string {
    switch (outputType) {
      case OutputType.RSS:
        return 'application/rss+xml';
      case OutputType.JSON:
        return 'application/json';
      case OutputType.ATOM:
      default:
        return 'application/atom+xml';

    }
  }

  register(app: Express) {

    app.get('/api/feed/live', cors(), (request: Request, response: Response) => {
      try {
        const url = request.query.url as string;

        feedService.parseFeed(url, feedService.toOptions(request), true)
          .then((feedParserResult: FeedParserResult) => {
            response.json(feedParserResult);

          })
          .catch((err: FeedParserError) => {
            logger.error(`Failed to proxy ${url}, cause ${err.message}`);
            response.json(err);
          });

      } catch (e) {
        response.json({message: e.message} as FeedParserError);
      }
    });

    app.get('/api/feed', cors(), (request: Request, response: Response) => {
      const url = request.query.url as string;
      try {
        const options = feedService.toOptions(request);

        // see https://www.geeksforgeeks.org/http-headers-retry-after/
        response.setHeader('Retry-After', 600); // 10 minutes

        const startTime = new Date().getTime();
        feedService.parseFeedCached(url, options)
          .then((feedData: SimpleFeedResult | GetResponse) => {
            if ((feedData as any)['type'] === 'GetResponse') {
              const getResponse = feedData as GetResponse;
              response.set('Charset', 'utf-8');
              response.setHeader('Content-Type', getResponse.contentType + '; charset=utf-8');
              response.write(iconv.encode(getResponse.body, 'utf8'));
              response.end();
            } else {
              const feedParserResult = feedData as FeedParserResult;
              response.set('Charset', 'utf-8');
              response.setHeader('Content-Type', FeedEndpoint.outputToContentType(options.o) + '; charset=utf-8');
              response.write(iconv.encode(feedParserResult.feed, 'utf8'));
              response.end();
            }

          })
          .catch((err: Error) => {
            FeedEndpoint.returnErrorFeed(url, err.message, options, response);
          })
          .finally(() => {
            logger.debug(`feed generated in ${new Date().getTime() - startTime} ms`);
          });

      } catch (e) {
        logger.error(`Internal error when proxying ${url}, cause ${e}`);
        FeedEndpoint.returnErrorFeed(url, e.message, null, response);
      }
    });
  }
};
