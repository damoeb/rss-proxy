const {expect} = require('chai');
const testHelper = require('./test-helper');

const Parser = require('../../app/parser');

describe('derstandard_at', () => {
  it('works', () => {

    const document = testHelper.getDocumetOfHtmlFile('test/pages/derstandard_at.html');

    const parser = new Parser(document, testHelper.getMockConsole());
    const rules = parser.findArticleRules();

    expect(rules[0]).to.eql({
        rules: {
          article: 'MAIN>DIV.layout>SECTION>ARTICLE',
          articleTagName: 'ARTICLE',
          title: 'A.teaser-inner>HEADER>H1.teaser-title',
          description: 'A.teaser-inner>HEADER>P.teaser-subtitle',
          link: 'A'
        },
        stats: {
          articleCount: 24,
          avgTitleWordCount: 7.289940828402367,
          avgDescriptionWordCount: 16.597633136094675,
          titleDiffersDescription: true
        },
        score: 24
      }
    );

  });
});
