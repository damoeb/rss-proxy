const {expect} = require('chai');
const testHelper = require('./test-helper');

const Parser2 = require('../../app/parser2');

describe('gohugo_io', () => {

  let document, parser;

  beforeEach(() => {
    document = testHelper.getDocumetOfHtmlFile('test/pages/gohugo_io.html');
    parser = new Parser2(document, testHelper.getMockConsole());
  });

  it.skip('#findArticleRules works', () => {

    const rules = parser.findArticleRules();

    expect(rules[0].rules).to.eql({
        article: 'MAIN.content-with-sidebar>DIV>DIV.flex.flex-wrap>SECTION.flex-ns.flex-wrap.justify-between.v-top>DIV',
        articleTagName: 'DIV',
        title: 'DIV.bg-white.gray>H1.near-black>A.link.primary-color.dim',
        description: 'DIV.bg-white.gray>DIV.lh-copy.links',
        link: 'DIV.bg-white.gray>H1.near-black>A'
      }
    );

  });

  it('#findArticles works', () => {

    const articles = parser.getArticles();

    expect(articles[0]).to.eql({
        title: 'Hugo 0.57.2: A couple of Bug Fixes',
        link: '/news/0.57.2-relnotes/',
        "description": [
          "August 17, 2019",
          "Hugo 0.57.2: A couple of Bug Fixes",
          "August 17, 2019Hugo 0.57.2: A couple of Bug FixesThis version fixes a couple of bugs introduced in 0.57.0.\n  Read More »",
          "This version fixes a couple of bugs introduced in 0.57.0.\n  Read More »",
          "Read More »"
        ]

  }
    );

  });

});
