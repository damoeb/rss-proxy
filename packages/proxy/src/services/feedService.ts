import * as request from 'request';
import {Article, ContentResolutionType, FeedParser, FeedParserOptions, FeedParserResult, FeedUrl, OutputType} from '@rss-proxy/core';
import {SourceType} from '@rss-proxy/core/dist/feed-parser';
import {JSDOM} from 'jsdom';
import {Feed} from 'feed';
import {LogCollector} from '@rss-proxy/core/dist/LogCollector';
import {Item} from 'feed/lib/typings';


export interface GetResponse {
  body: string
  contentType: string
}

export const feedService =  new class FeedService {
  async mapToFeed(url: string, options: FeedParserOptions): Promise<FeedParserResult> {

    const response = await this.download(url, options.source);

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

  private download(url: string, source: SourceType): Promise<GetResponse> {
    return new Promise<GetResponse>((resolve, reject) => {
      const options = {method:'GET', url, headers: {"content-type": "text/plain"}};
      request(options, (error, serverResponse, html) => {
        if (!error && serverResponse && serverResponse.statusCode === 200) {
          resolve({body: html, contentType: serverResponse.headers['content-type']});
        } else {
          reject(error);
        }
      });
    });
  }


  private async generateFeedFromUrl(url: string, html: string, options: FeedParserOptions, feeds: FeedUrl[]): Promise<FeedParserResult> {

    const logCollector = new LogCollector();

    const doc = new JSDOM(html).window.document;
    const feedParser = new FeedParser(doc, options, logCollector);

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
      // author: {
      //   name: "John Doe",
      //   email: "johndoe@example.com",
      //   link: "https://example.com/johndoe"
      // }
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
      usesExistingFeed: false,
      logs: logCollector.logs(),
      options,
      rules: rules,
      feeds,
      html,
      articles: articles,
      feedOutputType: options.output,
      feed: await this.tryAddDeepContent(options.content)(feed)
        .then(this.renderFeed(options.output))
    });
  }

  private tryAddDeepContent(content: ContentResolutionType): (feed: Feed) => Promise<Feed> {
    return (feed: Feed) => {
      if (content === ContentResolutionType.DEEP) {
        feed.items.map(item => this.addDeepContent(item))
        // console.log('Would use puppeteer to resolve deep content');
      }
      return Promise.resolve(feed);
    };
  }

  private addDeepContent(item: Item) {
    // todo dowload
    // <meta name=author content="DER SPIEGEL, Hamburg, Germany">
    // <meta name=msvalidate.01 content="0EE91CCF2745FAE5C53BFE9A010D3C79">
    // <meta name=description content="Deutschlands führende Nachrichtenseite. Alles Wichtige aus Politik, Wirtschaft, Sport, Kultur, Wissenschaft, Technik und mehr.">
    // <meta name=last-modified content="2020-01-21T21:20:21+01:00">
    // <meta name=locale content="de_DE">
    // <meta property="fb:page_id" content>
    // <meta property="twitter:account_id" content="2834511">
    // <meta name=twitter:card content="summary_large_image">
    // <meta name=twitter:site content="@derspiegel">
    // <meta name=twitter:title content="DER SPIEGEL | Online-Nachrichten">
    // <meta name=twitter:creator content="@derspiegel">
    // <meta name=twitter:image content="https://www.spiegel.de/public/spon/images/logos/fb_logo_default.jpg">
    // <meta property="og:title" content="DER SPIEGEL | Online-Nachrichten">
    // <meta property="og:type" content="website">
    // <meta property="og:url" content="https://www.spiegel.de/">
    // <meta property="og:image" content="https://www.spiegel.de/public/spon/images/logos/fb_logo_default.jpg">
    // <meta property="og:description" content="Deutschlands führende Nachrichtenseite. Alles Wichtige aus Politik, Wirtschaft, Sport, Kultur, Wissenschaft, Technik und mehr.">

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
