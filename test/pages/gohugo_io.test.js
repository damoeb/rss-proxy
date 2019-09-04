const {expect} = require('chai');
const testHelper = require('./test-helper');

const Parser = require('../../app/parser');

describe('gohugo_io', () => {

  let document, parser;

  beforeEach(() => {
    document = testHelper.getDocumetOfHtmlFile('test/pages/gohugo_io.html');
    parser = new Parser(document, testHelper.getMockConsole());
  });

  it('#findArticleRules works', () => {

    const rules = parser.findArticleRules();

    expect(rules[0]).to.eql({
        rules: {
          article: 'MAIN.content-with-sidebar>DIV>DIV.flex.flex-wrap>SECTION.flex-ns.flex-wrap.justify-between.v-top>DIV',
          articleTagName: 'DIV',
          title: 'DIV.bg-white.gray>H1.near-black>A.link.primary-color.dim',
          description: 'DIV.bg-white.gray>DIV.lh-copy.links',
          link: 'DIV.bg-white.gray>H1.near-black>A'
        },
        stats: {
          articleCount: 95,
          avgTitleWordCount: 4.347368421052631,
          avgDescriptionWordCount: 18.073684210526316,
          titleDiffersDescription: true
        },
        score: 95
      }
    );

  });

  it('#findArticles works', () => {

    const articles = parser.findArticles();

    expect(articles[0]).to.eql({
        title: 'Hugo 0.57.2: A couple of Bug Fixes',
        link: '/news/0.57.2-relnotes/',
        description: 'This version fixes a couple of bugs introduced in 0.57.0.\n  Read More »'
      }
    );

  });

});
