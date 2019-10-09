const {expect} = require('chai');
const testHelper = require('./test-helper');

const Parser = require('../../app/parser');
const Parser2 = require('../../app/parser2');

describe('derstandard_at', () => {

  let document, parser;

  beforeEach(() => {
    document = testHelper.getDocumetOfHtmlFile('test/pages/derstandard_at.html');
     parser = new Parser2(document, testHelper.getMockConsole());
  });

  it('#findArticles works', () => {

    const articles = parser.getArticles();

    expect(articles[0]).to.eql({
      title: 'Von blauen Netzwerken und schwarzen Rächern im Innenministerium',
      link: '/story/2000108150923/von-blaue-netzwerken-und-schwarzen-raechern-im-innenministerium',
      description: 'Aus dem Innenministerium dringen immer mehr Details zu Umfärbungen in der Ära Kickl – die FPÖ vermutet "schwarze Netzwerke" hinter den Leaks'
    });

  });
});
