const {expect} = require('chai');
const testHelper = require('./test-helper');

const Parser2 = require('../../app/parser2');

describe('mozilla-blog', () => {

  let document, parser;

  beforeEach(() => {
    document = testHelper.getDocumetOfHtmlFile('test/pages/mozilla-blog.html');
    parser = new Parser2(document, testHelper.getMockConsole());
  });

  it('#findArticles works', () => {

    const articles = parser.getArticles();

    expect(articles[0]).to.eql({
      title: 'Mozilla takes action to protect users in Kazakhstan',
      link: 'https://blog.mozilla.org/blog/2019/08/21/mozilla-takes-action-to-protect-users-in-kazakhstan/',
      "description": [
            "Mozilla takes action to protect users in Kazakhstan",
            "Mozilla",
            "August 21, 2019",
            "Today, Mozilla and Google took action to protect the online security and privacy of individuals in Kazakhstan. Together the companies deployed technical solutions within Firefox and Chrome to block the … Read more",
            "Read more"
          ]

    });

  });

});
