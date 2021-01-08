import {
  Article,
  ArticleRule,
  ContentType,
  FeedParser,
  FeedParserOptions,
  FeedParserResult,
  FeedUrl,
  LogCollector,
  OutputType,
  SimpleFeedResult
} from '@rss-proxy/core';
import {Feed} from 'feed';
import crypto from 'crypto';
import {isEmpty, isUndefined} from 'lodash';
import {Request} from 'express';

import {siteService} from './siteService';
import logger from '../logger';
import {config} from '../config';
import {cacheService} from './cacheService';


export interface GetResponse {
  body: string
  type: 'GetResponse'
  contentType: string
}

const defaultOptions: FeedParserOptions = {
  o: OutputType.ATOM,
  c: ContentType.RAW,
  js: false
};

export interface FeedParserError {
  message: string
  code?: number
  data?: Partial<FeedParserResult>
}


export const feedService = new class FeedService {
  private static toCacheKey(url: string, options: FeedParserOptions): string {
    // hash to limit length
    const sha1 = crypto.createHash('sha1');
    sha1.update(JSON.stringify(options));
    return `feed/${url}/${sha1.digest('hex')}`;
  }

  private static toURI(article: Article) {
    return `tag:rss-proxy.migor.org:${article.link}`;
  }

  private static isDefined(value: string) {
    return !isUndefined(value) && value !== 'undefined';
  }

  async mapToFeed(url: string, options: FeedParserOptions, liveSource: boolean): Promise<FeedParserResult | GetResponse> {

    const startTime = new Date().getTime();
    const response = await siteService.download(url, options.js);
    logger.info(`dl took ${new Date().getTime() - startTime} ${url}`);

    const contentType = response.contentType.split(';')[0].toLowerCase();

    const doc = siteService.toDom(response.body);

    switch (contentType) {
      case 'text/html':
        const feedUrls = this.findFeedUrls(doc, url);
        const returnNativeFeed = options.fallback && config.preferNativeFeed && feedUrls.length > 0
          && isEmpty(options.pContext);
        if (returnNativeFeed) {
          return await siteService.download(feedUrls[0].url);
        } else {
          return this.generateFeedFromUrl(url, response.body, doc, options, feedUrls, liveSource);
        }

      default:
        // todo xml2json
        return Promise.reject({message: `Content of type ${response.contentType} is not supported`} as FeedParserError);
    }
  }

  public parseFeedCached(url: string, options: FeedParserOptions): Promise<SimpleFeedResult | GetResponse> {
    if (isUndefined(options.pContext)) {
      return Promise.reject(new Error('query param pContext is not defined'));
    }
    if (isUndefined(options.pLink)) {
      return Promise.reject(new Error('query param pLink is not defined'));
    }
    const cacheKey = FeedService.toCacheKey(url, options);
    return cacheService.get<SimpleFeedResult | GetResponse>(cacheKey)
      .then((response) => {
        logger.debug('Cache hit');
        return response;
      })
      .catch(async () => {
        logger.debug('Cache miss');
        const response = await feedService.parseFeed(url, options);
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
    if (FeedService.isDefined(request.query.c as any)) {
      actualOptions.c = request.query.c as ContentType;
    }
    if (FeedService.isDefined(request.query.js as any)) {
      actualOptions.js = request.query.js === 'true';
    }
    if (FeedService.isDefined(request.query.o as any)) {
      actualOptions.o = request.query.o as OutputType;
    }
    if (FeedService.isDefined(request.query.xq as any)) {
      actualOptions.xq = request.query.xq as string;
    }
    if (FeedService.isDefined(request.query.pContext as any)) {
      actualOptions.pContext = request.query.pContext as string;
    }
    if (FeedService.isDefined(request.query.pLink as any)) {
      actualOptions.pLink = request.query.pLink as string;
    }
    return {...defaultOptions, ...actualOptions};
  }

  public parseFeed(url: string, options: FeedParserOptions, liveSource = false): Promise<FeedParserResult | GetResponse> {

    logger.info(`Parsing ${url} with options ${JSON.stringify(options)}`);

    if (!url) {
      return Promise.reject({message: 'Param url is missing'} as FeedParserError);
    }
    return feedService.mapToFeed(url, options, liveSource);
  }

  public mapErrorToFeed(url: string, message: string, options: FeedParserOptions): string {
    let id = 'tag:rss-proxy.migor.org:error';
    if (options) {
      id = `${id}-contextXPath:${options.pContext}-linkXPath:${options.pLink}`;
    } else {
      // render one internal error per month
      const today = new Date();
      id = `${id}:internal-error:${today.getFullYear()}-${today.getMonth()}`;
    }
    const feed = new Feed({
      title: 'rss-proxy error',
      id,
      link: url,
      generator: 'rss-proxy',
      copyright: 'rss-proxy'
    });

    feed.addItem({
      title: 'Error',
      link: `https://rssproxy.migor.org?url=${encodeURIComponent(url)}`,
      published: new Date(),
      date: new Date(),
      content: `${message} Try to resolve the issue on provided link.`
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
      title: doc.title + ' via rss-proxy',
      id: url,
      link: url,
      language: meta.language,
      copyright: meta.copyright,
      docs: 'https://github.com/damoeb/rss-proxy',
      generator: `rss-proxy ${config.build.version}`,
      feedLinks: feeds.reduce((map: any, feed) => {
        map[feed.name] = feed.url;
        return map;
      }, {})
    });

    let rules: ArticleRule[];
    let rule: ArticleRule;
    if (liveSource) {
      rules = feedParser.getArticleRules();
      rule = this.getArticleRule(rules, options.pContext + options.pLink, liveSource);
    } else {
      rules = [];
      rule = {
        contextXPath: options.pContext,
        linkXPath: options.pLink,
        id: options.pLink
      };
    }

    let articles: Article[] = [];
    if (rules.length > 0 || !liveSource) {
      articles = feedParser.getArticlesByRule(rule);
      articles.forEach((article: Article) => {
        feed.addItem({
          id: FeedService.toURI(article),
          title: article.title,
          link: article.link, // todo mag ATOM feeds render unescaped & which causes an invalid xml, RSS feeds work fine
          published: new Date(),
          date: new Date(),
          content: FeedService.getContent(options, article)
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
        feedOutputType: options.o,
        feed: this.renderFeed(options.o)(feed)
      });

    } else {
      return Promise.reject({
        message: 'No article-rules found',
        data: {
          logs: logCollector.logs(),
          feeds,
          html,
          feedOutputType: options.o
        }
      } as FeedParserError);

    }
  }

  private static getContent(options: FeedParserOptions, article: Article) {
    if (options.c === ContentType.RAW) {
      return article.content
    }
    if (options.c === ContentType.TEXT) {
      return article.text
    }
    if (article.title.length > 0) {
      return ''
    }

    return article.text;
  }

  private findFeedUrls(doc: Document, url: string): FeedUrl[] {

    const types = ['application/atom+xml', 'application/rss+xml', 'application/json'];

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
        };
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
          return feed.json1();
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
};
