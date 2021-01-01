import {
  Article, ArticleRule,
  FeedParser,
  FeedParserOptions,
  FeedParserResult,
  FeedUrl,
  OutputType,
  LogCollector,
  SimpleFeedResult
} from '@rss-proxy/core';
import {Feed} from 'feed';
import {isEmpty} from 'lodash';
import {siteService} from './siteService';
import {Request} from 'express';
import logger from '../logger';
import {config} from '../config';
import {cacheService} from './cacheService';


export interface GetResponse {
  body: string
  type: 'GetResponse'
  contentType: string
}

const defaultOptions: FeedParserOptions = {
  output: OutputType.ATOM,
};

export interface FeedParserError {
  message: string
  code?: number
  data?: Partial<FeedParserResult>
}


export const feedService =  new class FeedService {
  async mapToFeed(url: string, options: FeedParserOptions, canUseNativeFeed: boolean, liveSource: boolean): Promise<FeedParserResult | GetResponse> {

    const response = await siteService.download(url);

    const contentType = response.contentType.split(';')[0].toLowerCase();
    logger.info(`Fetched ${url} with contentType ${response.contentType} -> main type ${contentType}`);

    const doc = siteService.toDom(response.body);

    switch (contentType) {
      case 'text/html':
        const feedUrls = this.findFeedUrls(doc, url);
        const returnNativeFeed = canUseNativeFeed && config.preferNativeFeed && feedUrls.length > 0
          && isEmpty(options.rule);
        if (returnNativeFeed) {
          return await siteService.download(feedUrls[0].url);
        } else {
          return this.generateFeedFromUrl(url, response.body, doc, options, feedUrls, liveSource);
        }

      default:
        // todo xml2json
        return Promise.reject({message: `Content of type ${response.contentType} is not supported`} as FeedParserError)
    }
  }

  public parseFeedCached(url: string, options: FeedParserOptions, canUseNativeFeed: boolean = false): Promise<SimpleFeedResult | GetResponse> {
    const cacheKey = FeedService.toCacheKey(url, options);
    return cacheService.get<SimpleFeedResult | GetResponse>(cacheKey)
      .then((response) => {
        logger.debug('Cache hit');
        return response;
      })
      .catch(async () => {
        logger.debug('Cache miss');
        const response = await feedService.parseFeed(url, options, canUseNativeFeed);
        if ((response as any)['type'] !== 'GetResponse') {
          cacheService.put(cacheKey, {feed: (response as FeedParserResult).feed});
        } else {
          cacheService.put(cacheKey, response);
        }
        return response;
      });
  }

  public toOptions(request: Request): FeedParserOptions {
    const actualOptions: Partial<FeedParserOptions> = {};
    if (request.query.output) {
      actualOptions.output = request.query.output as OutputType;
    }
    if (request.query.rule) {
      actualOptions.rule = request.query.rule as string;
    }
    return {...defaultOptions, ...actualOptions};
  }

  public parseFeed(url: string, options: FeedParserOptions, canUseNativeFeed: boolean, liveSource = false): Promise<FeedParserResult | GetResponse> {

      logger.info(`Parsing ${url} with options ${JSON.stringify(options)}`);

      if (!url) {
        return Promise.reject({message: 'Param url is missing'} as FeedParserError);
      }
      return feedService.mapToFeed(url, options, canUseNativeFeed, liveSource);
    }

  public mapErrorToFeed(url: string, message: string): string {
    const feed = new Feed({
      title: 'rss-proxy error',
      id: url,
      link: url,
      generator: "rss-proxy",
      copyright: "rss-proxy"
    });

    feed.addItem({
      title: 'Error',
      link: `https://rssproxy.migor.org?url=${encodeURIComponent(url)}`,
      published: new Date(),
      date: new Date(),
      content: `${message} Try to resolve the issue on provide link.`
    });
    return feed.atom1();
  }

  private async generateFeedFromUrl(url: string,
                                    html: string,
                                    doc: Document,
                                    options: FeedParserOptions,
                                    feeds: FeedUrl[],
                                    liveSource: boolean): Promise<FeedParserResult> {

    const logCollector = new LogCollector();

    const feedParser = new FeedParser(doc, url, options, logCollector);

    const meta = siteService.getMeta(doc);

    const feed = new Feed({
      title: doc.title,
      // description: doc.,
      id: url,
      link: url,
      // author: this.getMetatag(doc, ''),
      language: meta.language,
      favicon: meta.favicon,
      copyright: meta.copyright,
      // updated: new Date(2013, 6, 14), // optional, default = today
      generator: "rss-proxy", // optional, default = 'Feed for Node.js'
      feedLinks: feeds.reduce((map:any, feed) => {
        map[feed.name] = feed.url;
        return map;
      }, {})
    });

    let rules: ArticleRule[];
    let rule: ArticleRule;
    if (liveSource) {
      rules = feedParser.getArticleRules();
      rule = this.getArticleRule(rules, options.rule, liveSource);
    } else {
      rules = [];
      const parts = options.rule.split('||');
      rule = {
        contextXPath: parts[0],
        linkXPath: parts[1],
        id: parts[1]
      };
    }

    let articles: Article[] = [];
    if (rules.length > 0 || !liveSource) {
      articles = feedParser.getArticlesByRule(rule);
      articles.forEach((article: Article) => {
        feed.addItem({
          title: article.title,
          link: article.link,
          published: new Date(),
          date: new Date(),
          // description: article.summary.join(' / '),
          content: article.content
        });
      });

      return Promise.resolve({
        usesExistingFeed: false,
        logs: logCollector.logs(),
        options,
        rules: rules,
        feeds,
        html,
        articles: articles,
        feedOutputType: options.output,
        feed: this.renderFeed(options.output)(feed)
      });

    } else {
      return Promise.reject({
        message: 'No article-rules found',
        data: {
          logs: logCollector.logs(),
          feeds,
          html,
          feedOutputType: options.output
        }
      } as FeedParserError);

    }
  }

  private findFeedUrls(doc: Document, url: string): FeedUrl[] {

    const types = ["application/atom+xml", "application/rss+xml", "application/json"];

    const feedUrls = types.map(type => Array.from(doc.querySelectorAll(`link[href][type="${type}"]`)))
      .flat(1)
      .map(linkElement => {
        let feedUrl = linkElement.getAttribute('href');
        let optionalSlash = '';
        if (!url.endsWith('/')) {
          optionalSlash = '/';
        }
        if (!feedUrl.startsWith('http://') && !feedUrl.startsWith('https://')) {
          feedUrl = url + optionalSlash + feedUrl;
        }

        return {
          name: linkElement.getAttribute('title'),
          url: feedUrl
        }
      });

    logger.debug(`Found ${feedUrls.length} native feeds in site ${url}`);

    return feedUrls;
  }

  private renderFeed(output: OutputType) {
    return (feed: Feed) => {
      switch (output) {
            case OutputType.ATOM:
              return feed.atom1();
            case OutputType.RSS:
              return feed.rss2();
            default:
            case OutputType.JSON:
              return feed.json1()
          }
    };
  }

  private getArticleRule(rules: ArticleRule[], ruleId: string, liveSource: boolean): ArticleRule {
    const matchedRule = rules.find(rule => rule.id == ruleId);
    if (matchedRule) {
      console.log(`Applying article-rule ${ruleId}`);
      return matchedRule;
    } else {
      if (liveSource) {
        return rules[0];
      } else {
        if (ruleId) {
          throw new Error(`Cannot generate Feed cause website has changed.`);
        } else {
          throw new Error(`Feed is not fully specified.`);
        }
      }
    }
  }

  private static toCacheKey(url: string, options: FeedParserOptions): string {
    return `feed/${url}/${JSON.stringify(options)}`;
  }
};
