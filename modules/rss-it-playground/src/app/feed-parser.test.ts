import {JSDOM} from 'jsdom';
import {FeedParser} from './feed-parser';
import {expect} from 'chai';
import {describe, it} from 'mocha';

describe('FeedParser', () => {

  const toDocument = (markup: string): HTMLDocument => new JSDOM(markup).window.document;

  it('unique', () => {
    const feedParser = new FeedParser(null);

  });

  it('findTextNodesInContext', () => {
    const markup = `<!DOCTYPE html>
<html>
<body>
<div id="context-el">
    <div class="post" itemscope="" itemtype="http://schema.org/BlogPosting">
        <h2 class="title" itemprop="name">
            <a href="https://developers.googleblog.com/2019/12/mpaani-raises-series-from-connections.html"
               itemprop="url">
                mPaani raises Series A from connections made at Google's accelerator
            </a>
        </h2>
        <div class="post-header">
            <div class="published">
                <span class="publishdate" itemprop="datePublished">Monday, December 16, 2019</span>
            </div>
        </div>
        <div class="post-body">
            <div class="post-content post-summary">
                <em>Jen Harvey, Head of Marketing, Google Developers Launchpad</em>
                <br>
                <p>
                    Google Developers Launchpad is an accelerator program that excels in helping startups solve the
                    world’s biggest problems through the best of Google, with a focus on advanced technology. However
                    our impact doesn’t stop there. A distinguishing aspect of our program is the network that we build
                    with, and for, our founders. Over the past five years, Launchpad has created a global community of
                    founders based on deep, genuine connections that we foster during the program, and that community
                    supports one another in remarkable ways.
                </p><a href="https://developers.googleblog.com/2019/12/mpaani-raises-series-from-connections.html"
                       class="read-more">Read More</a></div>
            <div class="post-content post-original" itemprop="articleBody">
                <em>Jen Harvey, Head of Marketing, Google Developers Launchpad</em>
                <br>
                <p>
                    Google Developers Launchpad is an accelerator program that excels in helping startups solve the
                    world’s biggest problems through the best of Google, with a focus on advanced technology. However
                    our impact doesn’t stop there. A distinguishing aspect of our program is the network that we build
                    with, and for, our founders. Over the past five years, Launchpad has created a global community of
                    founders based on deep, genuine connections that we foster during the program, and that community
                    supports one another in remarkable ways.
                </p>
            </div>
        </div>
        <div class="jump-link">
            <a class="maia-button maia-button-secondary"
               href="https://developers.googleblog.com/2019/12/mpaani-raises-series-from-connections.html#more">
                Read more »
            </a>
        </div>
        <div class="comment-container">
            <i class="comment-img material-icons">
                
            </i>
        </div>
        <div class="post-footer">
            <a href="https://plus.google.com/112374322230920073195" rel="author">
                Google
            </a>
        </div>
    </div>

</div>
</body>
</html>`;

    const doc = toDocument(markup);
    const context = doc.getElementById('context-el');

    const feedParser = new FeedParser(doc);

    const nodes = feedParser.findTextNodesInContext(context);

    expect(nodes.map(node => node.parentElement.tagName)).to.eql(['A', 'SPAN', 'EM', 'P', 'A', 'EM', 'P', 'A', 'I', 'A']);
  });
});
