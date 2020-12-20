import {JSDOM} from 'jsdom';
import {ContentResolutionType, FeedParser, OutputType, SourceType} from './feed-parser';
import {expect} from 'chai';
import {describe, it} from 'mocha';
import * as fs from 'fs';

describe('Raw Websites', () => {

  const toDocument = (markup: string): HTMLDocument => new JSDOM(markup).window.document;

  fs.readdir('./src/test-feeds', (err, files) => {
    if (err) {
      throw err;
    }

    // files object contains all files names
    // log them on console
    files
      .filter(file => file.endsWith('input.html'))
      // .filter((file, index) => index === 3)
      .forEach(file => {

      it(`validate feed generation from ${file}`, () => {

        const markup = fs.readFileSync('./src/test-feeds/'+ file, 'utf8');
        const expectedLinks = fs.readFileSync('./src/test-feeds/'+ file.replace('input.html', 'output.json'), 'utf8');

        const doc = toDocument(markup);
        const options = {content: ContentResolutionType.STATIC, output: OutputType.JSON, source: SourceType.STATIC};
        const feedParser = new FeedParser(doc, 'http://example.com', options, {log: () => {}, error: console.error});

        const links = feedParser.getArticles().map(article => article.link)
        // console.log(JSON.stringify(links));
        expect(links).to.eql(JSON.parse(expectedLinks));
      });
    });
  });

});
