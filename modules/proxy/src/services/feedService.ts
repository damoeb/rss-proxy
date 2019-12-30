import * as request from 'request';
import {JSDOM} from 'jsdom';
import {FeedParser, Article} from 'rssproxy-core';

export interface MappedFeedResponse {
  articles: Article[]
}

// todo maps a url to an rss feed
export const feedService =  new class FeedService {
  mapToFeed(url: string): Promise<MappedFeedResponse> {
    return new Promise((resolve, reject) => {
      request(url, (error, serverResponse, body) => {
        if (!error && serverResponse && serverResponse.statusCode === 200) {

          const doc = new JSDOM(body).window.document;
          const feedParser = new FeedParser(doc);

          resolve({articles: feedParser.getArticles() });
        } else {
          console.error(`proxy error ${url} cause ${error}, ${serverResponse.statusCode}`);
          reject(error);
        }
      });
    });
  }
}
