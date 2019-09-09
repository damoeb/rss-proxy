const {expect} = require('chai');
const testHelper = require('./test-helper');

const Parser = require('../../app/parser');

describe('developers_googleblog_com', () => {

  let document, parser;

  beforeEach(() => {
    document = testHelper.getDocumetOfHtmlFile('test/pages/developers_googleblog_com.html');
    parser = new Parser(document, testHelper.getMockConsole());
  });

  it('#findArticleRules works', () => {

    const rules = parser.findArticleRules();

    // console.log(rules);

    expect(rules[0].rules).to.eql({
      article: 'DIV.cols-wrapper.loading>DIV.col-main-wrapper>DIV.col-main>DIV.section>DIV.widget.Blog>DIV',
      articleTagName: 'DIV',
      title: 'H2.title>A',
      description: 'DIV.post-body>DIV.post-content',
      link: 'H2.title>A'
    });

  });

  it.skip('#findArticles works', () => {

    const articles = parser.findArticles();

    expect(articles[0]).to.eql({
      title: 'Mozilla takes action to protect users in Kazakhstan',
      link: 'https://blog.mozilla.org/blog/2019/08/21/mozilla-takes-action-to-protect-users-in-kazakhstan/',
      description: 'Today, Mozilla and Google took action to protect the online security and privacy of individuals in Kazakhstan. Together the companies deployed technical solutions within Firefox and Chrome to block the … Read more'
    });

  });

});
