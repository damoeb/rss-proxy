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
  describe('#indexOf()', () => {
    it('should return -1 when the value is not present', () => {

      const document = testHelper.getDocumetOfHtmlFile('test/mozilla-blog.html');

      const parser = new Parser(document);
      const rules = parser.findArticleRules();

      expect(rules[0]).to.eql({
        "rules": {
          "article": "DIV>MAIN>DIV>ARTICLE",
          "description": "DIV>P",
          "link": "HEADER>A",
          "title": "HEADER>A>H2"
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
});
