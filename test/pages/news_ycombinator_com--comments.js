const {expect} = require('chai');
const testHelper = require('./test-helper');

const Parser = require('../../app/parser');

describe('news_ycombinator_com--comments', () => {
  it('works', () => {

    const document = testHelper.getDocumetOfHtmlFile('test/pages/news_ycombinator_com--comments.html');

    const parser = new Parser(document, testHelper.getMockConsole());
    const rules = parser.findArticleRules();

    expect(rules[0]).to.eql({
        rules: {
          article: 'CENTER>TABLE>TBODY>TR>TD>TABLE.comment-tree>TBODY>TR',
          articleTagName: 'TR',
          title: 'TD>TABLE>TBODY>TR>TD.default>DIV.comment>SPAN.commtext',
          description: 'TD>TABLE>TBODY>TR>TD.default>DIV.comment>SPAN.commtext',
          link: 'TD>TABLE>TBODY>TR>TD.default>DIV>SPAN.comhead>A'
        },
        stats: {
          articleCount: 30,
          avgTitleWordCount: 61.36666666666667,
          avgDescriptionWordCount: 61.36666666666667,
          titleDiffersDescription: false
        },
        score: 30
      }
    );

  });
});
