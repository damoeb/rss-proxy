import * as request from 'request';
import {Article, ContentResolutionType, FeedParser, FeedParserOptions, FeedParserResult, OutputType} from '@rss-proxy/core';
import {SourceType} from '@rss-proxy/core/dist/feed-parser';
import {JSDOM} from 'jsdom';
import {Feed} from 'feed';
import {LogCollector} from '@rss-proxy/core/dist/LogCollector';

export interface FeedUrl {
  name: string;
  url: string;
}

export const feedService =  new class FeedService {
  async mapToFeed(url: string, options: FeedParserOptions): Promise<FeedParserResult> {

    const html = await this.download(url, options.source);
    const doc = new JSDOM(html).window.document;
    const feedUrls = this.findFeedUrls(doc);

    function firstFeed(feedUrls: FeedUrl[], logCollector: LogCollector) {
      const firstFeed = feedUrls[0];
      logCollector.log('Using feed url', firstFeed.url);
      return firstFeed.url;
    }

    if (options.preferExistingFeed && feedUrls.length > 0) {
      const logCollector = new LogCollector();
      return this.download(firstFeed(feedUrls, logCollector), options.source)
        .then(feedString => JSON.parse(feedString) as Feed)
        .then(this.tryAddDeepContent(options.contentResolution))
        .then(feed => {
          return {
            logs: logCollector.logs(),
            options,
            rules: null,
            html,
            articles: null,
            feed: this.renderFeed(options.output)(feed)
          };
        });
    } else {

      return this.generateFeedFromUrl(url, html, options);
    }
  }

  private download(url: string, source: SourceType): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      request(url, (error, serverResponse, html) => {
        if (!error && serverResponse && serverResponse.statusCode === 200) {
          resolve(html);
        } else {
          reject(error);
        }
      });
    });
  }


  private async generateFeedFromUrl(url: string, html: string, options: FeedParserOptions): Promise<FeedParserResult> {

    const logCollector = new LogCollector();

    const doc = new JSDOM(html).window.document;
    const feedParser = new FeedParser(doc, options, logCollector);

    // todo detect feed

    const feed = new Feed({
      title: doc.title,
      // description: doc.,
      id: url,
      link: url,
      // language: 'en', // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
      // favicon: "http://example.com/favicon.ico",
      copyright: "All rights reserved 2013, John Doe",
      // updated: new Date(2013, 6, 14), // optional, default = today
      generator: "rss-proxy", // optional, default = 'Feed for Node.js'
      feedLinks: {
        json: "https://example.com/json",
        atom: "https://example.com/atom"
      },
      author: {
        name: "John Doe",
        email: "johndoe@example.com",
        link: "https://example.com/johndoe"
      }
    });

    // todo pass options.parser
    const rules = feedParser.getArticleRules();

    const articles = feedParser.getArticlesByRule(rules[0]);
    articles.forEach((article: Article) => {
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
      logs: logCollector.logs(),
      options,
      rules: rules,
      html,
      articles: articles,
      feed: await this.tryAddDeepContent(options.contentResolution)(feed)
        .then(this.renderFeed(options.output))
    });
  }

  private tryAddDeepContent(contentResolution: ContentResolutionType): (feed: Feed) => Promise<Feed> {
    return (feed: Feed) => {
      if (contentResolution === ContentResolutionType.DEEP) {
        console.log('Would use puppeteer to resolve deep content');
      }
      return Promise.resolve(feed);
    };
  }

  private findFeedUrls(doc: Document): FeedUrl[] {
    /*
    List<String> types = Arrays.asList("application/atom+xml", "application/rss+xml", "application/json");
this.feeds = document.head().childNodes().stream().filter(node -> {
 return node.nodeName().equalsIgnoreCase("link")
   && node.hasAttr("type")
   && node.hasAttr("href")
   && types.contains(node.attr("type"));
}).map(node -> {
 return new LinkElement(node.attr("title"), absoluteUrl(baseUrl, node.attr("href")), node.attr("type"));
}).collect(Collectors.toSet());

 */
    return [];
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
};
