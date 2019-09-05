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

  it('#findArticles works', () => {

    const articles = parser.findArticles();

    console.log(articles);

    expect(articles[0]).to.eql({
      title: 'Off-Grid, Solar-Powered, Zero-Battery Refrigerator',
      link: 'https://www.notechmagazine.com/2019/09/off-grid-solar-powered-zero-battery-refrigerator.html',
      description: 'Off-Grid, Solar-Powered, Zero-Battery Refrigerator'
    },);

  });

});
