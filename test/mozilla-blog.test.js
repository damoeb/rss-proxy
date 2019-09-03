const {expect} = require('chai');
const testHelper = require('./test-helper');

const Parser = require('../app/parser');

if (!Array.prototype.flat) {
  Object.defineProperty(Array.prototype, 'flat', {
    value: function (depth = 1) {
      return this.reduce(function (flat, toFlatten) {
        return flat.concat((Array.isArray(toFlatten) && (depth > 1)) ? toFlatten.flat(depth - 1) : toFlatten);
      }, []);
    }
  });
}

describe('mozilla-blog', () => {
  it('works', () => {

    const document = testHelper.getDocumetOfHtmlFile('test/mozilla-blog.html');

    const parser = new Parser(document, testHelper.getMockConsole());
    const rules = parser.findArticleRules();

    expect(rules[0]).to.eql({
      "rules": {
        "article": "DIV.site-wrap>MAIN>DIV.content.posts-grid.hfeed>ARTICLE",
        "description": "DIV.entry-summary>P",
        "link": "HEADER.entry-header>A",
        "title": "HEADER.entry-header>A.entry-link>H2.entry-title"
      },
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
