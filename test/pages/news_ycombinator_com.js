const {expect} = require('chai');
const testHelper = require('./test-helper');

const Parser = require('../../app/parser');

describe('news_ycombinator_com', () => {
  it('works', () => {

    const document = testHelper.getDocumetOfHtmlFile('test/pages/news_ycombinator_com.html');

    const parser = new Parser(document, testHelper.getMockConsole());
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
});
