const {expect} = require('chai');
const testHelper = require('./test-helper');

const Parser = require('../../app/parser');

describe.skip('news_ycombinator_com--comments', () => {
  it('works', () => {

    const document = testHelper.getDocumetOfHtmlFile('test/pages/news_ycombinator_com--comments.html');

    const parser = new Parser(document, testHelper.getMockConsole());
    const rules = parser.findArticleRules();

    expect(rules[0]).to.eql({
      rules:
        {
          article: 'CENTER>TABLE>TBODY>TR>TD>TABLE.itemlist>TBODY>TR',
          title: 'TD.title>A.storylink',
          description: 'TD.title>A.storylink',
          link: 'TD.title>A'
        },
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
