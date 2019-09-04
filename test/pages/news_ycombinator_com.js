const {expect} = require('chai');
const testHelper = require('./test-helper');

const Parser = require('../../app/parser');

describe('news_ycombinator_com', () => {

  let document, parser;

  beforeEach(() => {
    document = testHelper.getDocumetOfHtmlFile('test/pages/news_ycombinator_com.html');
    parser = new Parser(document, testHelper.getMockConsole());
  });

  it('#findArticleRules works', () => {

    const rules = parser.findArticleRules();

    expect(rules[0]).to.eql({
      rules:
        {
          article: 'CENTER>TABLE>TBODY>TR>TD>TABLE.itemlist>TBODY>TR',
          articleTagName: 'TR',
          title: 'TD.title>A.storylink',
          description: 'TD.title>A.storylink',
          link: 'TD.title>A'
        },
      score: 30,
      stats:
        {
          articleCount: 30,
          avgTitleWordCount: 7.9,
          avgDescriptionWordCount: 7.9,
          titleDiffersDescription: false
        }
    });
  });

  it.skip('#findArticles works', () => {

    const articles = parser.findArticles();

    console.log(articles);

    expect(articles[0]).to.eql({
      title: 'Mozilla takes action to protect users in Kazakhstan',
      link: 'https://blog.mozilla.org/blog/2019/08/21/mozilla-takes-action-to-protect-users-in-kazakhstan/',
      description: 'Today, Mozilla and Google took action to protect the online security and privacy of individuals in Kazakhstan. Together the companies deployed technical solutions within Firefox and Chrome to block the … Read more'
    });

  });

});
