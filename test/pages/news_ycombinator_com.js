const {expect} = require('chai');
const testHelper = require('./test-helper');

const Parser = require('../../app/parser');

describe('news_ycombinator_com', () => {

  let document, parser;

  beforeEach(() => {
    document = testHelper.getDocumetOfHtmlFile('test/pages/news_ycombinator_com.html');
    parser = new Parser(document, testHelper.getMockConsole());
  });

  it.only('#findArticleRules works', () => {

    const rules = parser.findArticleRules();

    expect(rules[0].rules).to.eql({
        article: 'CENTER>TABLE>TBODY>TR>TD>TABLE.itemlist>TBODY>TR',
        articleTagName: 'TR',
        title: 'TD.title>A.storylink',
        description: 'TD.title>A.storylink',
        link: 'TD.title>A'
    });
  });

  it.skip('#findArticles works', () => {

    const articles = parser.findArticles();

    expect(articles[0]).to.eql({
      title: 'Off-Grid, Solar-Powered, Zero-Battery Refrigerator',
      link: 'https://www.notechmagazine.com/2019/09/off-grid-solar-powered-zero-battery-refrigerator.html',
      description: 'Off-Grid, Solar-Powered, Zero-Battery Refrigerator'
    },);

  });

});
