const {expect} = require('chai');
const testHelper = require('./test-helper');

const Parser = require('../../app/parser');

describe('derstandard_at', () => {
  it('works', () => {

    const document = testHelper.getDocumetOfHtmlFile('test/pages/derstandard_at.html');

    const parser = new Parser(document, testHelper.getMockConsole());
    const rules = parser.findArticleRules();

    // todo wait for merge-function
    expect(rules[0]).to.eql({
        rules:
          {
            article:
              'HEADER.site--header-next>DIV>SECTION.site-guide-next>DIV.js-site-portal-nav-root>DIV>NAV',
            title: 'DIV.hud-item>A>P',
            description: 'DIV.hud-item>A>P',
            link: 'DIV.hud-item>A'
          },
        stats:
          {
            articleCount: 4,
            avgTitleWordCount: 4.8,
            avgDescriptionWordCount: 4.8,
            titleDiffersDescription: false
          }
      }
    );

  });
});
