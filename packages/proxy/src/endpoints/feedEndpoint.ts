import {Express, Request, Response} from 'express';
import cors from 'cors';
import iconv from 'iconv-lite';
import logger from '../logger';
import {FeedParserError, feedService, GetResponse} from '../services/feedService';
import {FeedParserResult, SimpleFeedResult, OutputType} from '@rss-proxy/core';
import {analyticsService} from '../services/analyticsService';

export const feedEndpoint = new class FeedEndpoint {
  register(app: Express) {

    app.get('/api/feed/live', cors(), (request: Request, response: Response) => {
      try {
        const url = request.query.url as string;
        logger.info(`live feed-mapping of ${url}`);

        analyticsService.track('live-feed', request, {url});

        feedService.parseFeed(url, feedService.toOptions(request), false, true)
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
        analyticsService.track('feed', request, {url});
        const options = feedService.toOptions(request);

        // see https://www.geeksforgeeks.org/http-headers-retry-after/
        response.setHeader('Retry-After', 600) // 10 minutes

        logger.info(`feed-mapping of ${url} as ${options.output}`);
        feedService.parseFeedCached(url, options, true)
          .then((feedData: SimpleFeedResult | GetResponse) => {
            if ((feedData as any)['type'] === 'GetResponse') {
              const getResponse = feedData as GetResponse;
              response.set('Charset', 'utf-8');
              response.setHeader('Content-Type', getResponse.contentType + '; charset=utf-8');
              response.write(iconv.encode(getResponse.body, 'utf8'));
              response.end()
            } else {
              const feedParserResult = feedData as FeedParserResult;
              response.set('Charset', 'utf-8');
              response.setHeader('Content-Type', FeedEndpoint.outputToContentType(options.output) + '; charset=utf-8');
              response.write(iconv.encode(feedParserResult.feed, 'utf8'));
              response.end();
            }

          })
          .catch((err: FeedParserError) => {
            FeedEndpoint.returnErrorFeed(url, err.message, response);
          });

      } catch (e) {
        logger.error(`Internal error when proxying ${url}, cause ${e}`);
        FeedEndpoint.returnErrorFeed(url, e.message, response);
      }
    });
  }

  private static returnErrorFeed(url: string, message: string, response: Response) {
    const errorFeed = feedService.mapErrorToFeed(url, message);
    response.setHeader('Content-Type', 'application/atom+xml');
    response.write(errorFeed);
    response.end();
  }

  private static outputToContentType(outputType: OutputType): string {
    switch (outputType) {
      case OutputType.ATOM:
        return 'application/atom+xml';
      case OutputType.JSON:
        return 'application/json';
      case OutputType.RSS:
      default:
        return 'application/rss+xml';

    }
  }
};
