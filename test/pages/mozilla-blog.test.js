const {expect} = require('chai');
const testHelper = require('./test-helper');

const Parser = require('../../app/parser');

describe('mozilla-blog', () => {

  let document, parser;

  beforeEach(() => {
    document = testHelper.getDocumetOfHtmlFile('test/pages/mozilla-blog.html');
    parser = new Parser(document, testHelper.getMockConsole());
  });

  it('#findArticleRules works', () => {

    const rules = parser.findArticleRules();

    expect(rules[0]).to.eql({
      "rules": {
        "article": "DIV.site-wrap>MAIN>DIV.content.posts-grid.hfeed>ARTICLE",
        articleTagName: "ARTICLE",
        "description": "DIV.entry-summary>P",
        "link": "HEADER.entry-header>A",
        "title": "HEADER.entry-header>A.entry-link>H2.entry-title"
      },
      score: 12,
      "stats": {
        "articleCount": 12,
        "avgDescriptionWordCount": 33,
        "avgTitleWordCount": 10.833333333333334,
        "titleDiffersDescription": true
      }
      }
    );

  });

  it('#findArticles works', () => {

    const articles = parser.findArticles();

    expect(articles[0]).to.eql({
      title: 'Mozilla takes action to protect users in Kazakhstan',
      link: 'https://blog.mozilla.org/blog/2019/08/21/mozilla-takes-action-to-protect-users-in-kazakhstan/',
      description: 'Today, Mozilla and Google took action to protect the online security and privacy of individuals in Kazakhstan. Together the companies deployed technical solutions within Firefox and Chrome to block the … Read more'
    });

  });

});
