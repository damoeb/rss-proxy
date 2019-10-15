const {expect} = require('chai');
const testHelper = require('./test-helper');

const Parser2 = require('../../app/parser2');

describe('developers_googleblog_com', () => {

  let document, parser;

  beforeEach(() => {
    document = testHelper.getDocumetOfHtmlFile('test/pages/developers_googleblog_com.html');
    parser = new Parser2(document, testHelper.getMockConsole());
  });

  it.skip('#findArticles works', () => {

    const articles = parser.getArticles();

    expect(articles[0]).to.eql({
      title: 'Enabling developers and organizations to use differential privacy',
      link: 'https://developers.googleblog.com/2019/09/enabling-developers-and-organizations.html',
      description: 'Today, Mozilla and Google took action to protect the online security and privacy of individuals in Kazakhstan. Together the companies deployed technical solutions within Firefox and Chrome to block the … Read more'
    });

  });

});
