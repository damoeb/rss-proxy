import {
  Article, ArticleRule,
  ContentResolutionType,
  FeedParser,
  FeedParserOptions,
  FeedParserResult,
  FeedUrl,
  OutputType,
  SourceType
} from '@rss-proxy/core';
import {Feed} from 'feed';
import {LogCollector} from '@rss-proxy/core/dist/log-collector';
import {siteService} from './siteService';
import {Request} from 'express';
import logger from '../logger';


export interface GetResponse {
  body: string
  contentType: string
}

const defaultOptions: FeedParserOptions = {
  output: OutputType.ATOM,
  source: SourceType.STATIC,
  content: ContentResolutionType.STATIC
};

export interface FeedParserError {
  message: string
  code?: number
  data?: Partial<FeedParserResult>
}


export const feedService =  new class FeedService {
  async mapToFeed(url: string, options: FeedParserOptions): Promise<FeedParserResult> {

    const response = await siteService.download(url);

    const contentType = response.contentType.split(';')[0].toLowerCase();
    logger.info(`Fetched ${url} with contentType ${response.contentType} -> main type ${contentType}`);

    const doc = siteService.toDom(response.body);

    switch (contentType) {
      case 'text/html':
        const feedUrls = this.findFeedUrls(doc, url);

        return this.generateFeedFromUrl(url, response.body, doc, options, feedUrls);
      default:
        // todo xml2json
        return Promise.reject({message: `Content of type ${response.contentType} is not supported`} as FeedParserError)
    }
  }

  public parseFeed(url: string, request: Request): Promise<FeedParserResult> {
      const actualOptions: Partial<FeedParserOptions> = {};
      if (request.query.output) {
        actualOptions.output = request.query.output;
      }
      if (request.query.rule) {
        actualOptions.rule = request.query.rule;
      }
      if (request.query.content) {
        actualOptions.content = request.query.content;
      }
      const options: FeedParserOptions = {...defaultOptions, ...actualOptions};

      logger.info(`Parsing ${url} with options ${JSON.stringify(options)}`);

      if (!url) {
        return Promise.reject({message: 'Param url is missing'} as FeedParserError);
      }

      return feedService.mapToFeed(url, options);
    }


  private async generateFeedFromUrl(url: string, html: string, doc: Document, options: FeedParserOptions, feeds: FeedUrl[]): Promise<FeedParserResult> {

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

    const rules = feedParser.getArticleRules();

    let articles: Article[] = [];
    if (rules.length > 0) {
      articles = feedParser.getArticlesByRule(this.getArticleRule(rules, options.rule));
      articles.forEach((article: Article) => {
        article.link = this.applyReaderLink(article.link);
        feed.addItem({
          title: article.title,
          link: article.link,
          published: new Date(),
          date: new Date(),
          description: article.summary.join(' / '),
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

  private applyReaderLink(link: string) {
    // todo return `http://localhost:3000/api/reader?url=${encodeURIComponent(link)}`
    return link;
  }

  private findFeedUrls(doc: Document, url: string): FeedUrl[] {

    const types = ["application/atom+xml", "application/rss+xml", "application/json"];

    const feedUrls = types.map(type => Array.from(doc.querySelectorAll(`link[href][type="${type}"]`)))
      .flat(1)
      .map(linkElement => {
        return {
          name: linkElement.getAttribute('title'),
          url: linkElement.getAttribute('href'),
        }
      });

    logger.debug(`Found ${feedUrls.length} feeds in site ${url}`);

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

  private getArticleRule(rules: ArticleRule[], ruleId: string): ArticleRule {
    const matchedRule = rules.find(rule => rule.id == ruleId);
    if (matchedRule) {
      console.log(`Applying article-rule ${ruleId}`);
      return matchedRule;
    } else {
      if (ruleId && ruleId !== 'best') {
        console.log(`Falling back to best article-rule, could not find article-rule ${ruleId} in ${rules.map(rule => rule.id)}`);
      } else {
        console.log(`Falling back to best article-rule`);
      }
      return rules[0];
    }
  }
};
