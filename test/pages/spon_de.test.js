const {expect} = require('chai');
const testHelper = require('./test-helper');

const Parser = require('../../app/parser');

describe('spon_de', () => {
  it.skip('#findArticleRules works', () => {

    const document = testHelper.getDocumetOfHtmlFile('test/pages/spon_de.html');

    const parser = new Parser(document, testHelper.getMockConsole());
    const rules = parser.findArticleRules();

    // console.log(rules[0]);
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
