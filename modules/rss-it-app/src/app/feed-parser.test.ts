import {JSDOM} from 'jsdom';
import {FeedParser} from './feed-parser';
import {expect} from 'chai';

describe('FeedParser', () => {

  const toDocument = (markup: string): HTMLDocument => new JSDOM(markup).window.document;

  // it('findTextNodesInContext', () => {
  //   const feedParser = new FeedParser(null);
  //
  //   expect(!!feedParser).to.eq(true);
  // });

  it('findTextNodesInContext', () => {
    const markup = `<body><div id="root">
Here is <strong>a little</strong> snippet of text
<p>well formatted</p>
<p>even with <a>a link</a></p>
</div></body>-->`;

    const doc = toDocument(markup);
    const context = doc.getElementById('context-el');
    // expect(context).toBeDefined();

    const feedParser = new FeedParser(doc);

    expect(feedParser.findTextNodesInContext(context)).to.exist('');
  });
});
