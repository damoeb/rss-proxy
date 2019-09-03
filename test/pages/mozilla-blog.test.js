const {expect} = require('chai');
const testHelper = require('./test-helper');

const Parser = require('../../app/parser');

describe('mozilla-blog', () => {
  it('works', () => {

    const document = testHelper.getDocumetOfHtmlFile('test/pages/mozilla-blog.html');

    const parser = new Parser(document, testHelper.getMockConsole());
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
});
