const {expect} = require('chai');
const testHelper = require('./test-helper');

const Parser = require('../../app/parser');

describe('nature_com', () => {

  let document, parser;

  beforeEach(() => {
    document = testHelper.getDocumetOfHtmlFile('test/pages/nature_com.html');
    parser = new Parser(document, testHelper.getMockConsole());
  });

  it('#findArticles works', () => {

    const articles = parser.findArticles();

    expect(articles[0]).to.eql({
      title: 'First-ever picture of a black hole scoops US$3-million prize',
      link: '/articles/d41586-019-02659-5',
      description: 'The Event Horizon Telescope team wins a Breakthrough Prize — one of six awards covering physics, the life sciences and mathematics.'
    });

  });

});
