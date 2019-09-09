const {expect} = require('chai');
const testHelper = require('./test-helper');

const Parser = require('../../app/parser');

describe('derstandard_at', () => {

  let document, parser;

  beforeEach(() => {
    document = testHelper.getDocumetOfHtmlFile('test/pages/derstandard_at.html');
     parser = new Parser(document, testHelper.getMockConsole());
  });

  // it.skip('#findArticleRules works', () => {
  //   // todo improve speed
  //   parser.findCandidatesFromRoot();
  // });

  it('#findArticleRules works', () => {

    const rules = parser.findArticleRules();

    expect(rules[0].rules).to.eql({
        article: 'MAIN>DIV.layout>SECTION>ARTICLE',
        articleTagName: 'ARTICLE',
        title: 'A.teaser-inner>HEADER>H1.teaser-title',
        description: 'A.teaser-inner>HEADER>P.teaser-subtitle',
        link: 'A'
      }
    );

  });

  it('#findArticles works', () => {

    const articles = parser.findArticles();

    expect(articles[0]).to.eql({
      title: 'Von blauen Netzwerken und schwarzen Rächern im Innenministerium',
      link: '/story/2000108150923/von-blaue-netzwerken-und-schwarzen-raechern-im-innenministerium',
      description: 'Aus dem Innenministerium dringen immer mehr Details zu Umfärbungen in der Ära Kickl – die FPÖ vermutet "schwarze Netzwerke" hinter den Leaks'
    });

  });
});
