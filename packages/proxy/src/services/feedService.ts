import {Article, ContentResolutionType, FeedParser, FeedParserOptions, FeedParserResult, FeedUrl, OutputType} from '@rss-proxy/core';
import {JSDOM} from 'jsdom';
import {Feed} from 'feed';
import {LogCollector} from '@rss-proxy/core/dist/LogCollector';
import {Item} from 'feed/lib/typings';
import {siteService} from './siteService';


export interface GetResponse {
  body: string
  contentType: string
}

export const feedService =  new class FeedService {
  async mapToFeed(url: string, options: FeedParserOptions): Promise<FeedParserResult> {

    const response = await siteService.download(url);

    const contentType = response.contentType.split(';')[0].toLowerCase();

    switch (contentType) {
      case 'text/html':
        const feedUrls = this.findFeedUrls(response.body);

        return this.generateFeedFromUrl(url, response.body, options, feedUrls);
      default:
        // todo xml2json
        return Promise.reject(`Content of type ${response.contentType} is not supported`)
    }
  }

  private async generateFeedFromUrl(url: string, html: string, options: FeedParserOptions, feeds: FeedUrl[]): Promise<FeedParserResult> {

    const logCollector = new LogCollector();

    const doc = siteService.toDom(html);
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

    const articles = feedParser.getArticlesByRule(rules[0]);
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
  }

  private applyReaderLink(link: string) {
    return `http://localhost:3000/api/reader?url=${encodeURIComponent(link)}`
  }

  private findFeedUrls(html: string): FeedUrl[] {

    const types = ["application/atom+xml", "application/rss+xml", "application/json"];

    const doc = new JSDOM(html).window.document;

    return types.map(type => Array.from(doc.querySelectorAll(`link[href][type="${type}"]`)))
      .flat(1)
      .map(linkElement => {
        return {
          name: linkElement.getAttribute('title'),
          url: linkElement.getAttribute('href'),
        }
      });
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
