import {Express, Request, Response} from 'express';
import cors from 'cors';
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

        feedService.parseFeed(url, feedService.toOptions(request))
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
      try {
        const url = request.query.url as string;
        analyticsService.track('feed', request, {url});
        const options = feedService.toOptions(request);

        // see https://www.geeksforgeeks.org/http-headers-retry-after/
        response.setHeader('Retry-After', 600) // 10 minutes

        logger.info(`feed-mapping of ${url} as ${options.output}`);
        feedService.parseFeedCached(url, options, true)
          .then((feedData: SimpleFeedResult | GetResponse) => {
            if ((feedData as any)['type'] === 'GetResponse') {
              const getResponse = feedData as GetResponse;
              response.setHeader('Content-Type', getResponse.contentType);
              response.write(getResponse.body);
              response.end()
            } else {
              const feedParserResult = feedData as FeedParserResult;
              response.setHeader('Content-Type', FeedEndpoint.outputToContentType(options.output));
              response.write(feedParserResult.feed)
              response.end();
            }

          })
          .catch((err: FeedParserError) => {
            logger.error(`Failed to proxy ${url}, cause ${err.message}`);
            response.json(err);
          });

      } catch (e) {
        response.json({message: e.message} as FeedParserError);
      }
    });

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
