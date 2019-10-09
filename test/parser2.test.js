const {expect} = require('chai');
const Parser2 = require('../app/parser2');
const unmergedRules = require('./fixtures/unmerged-rules');
const mergedRules = require('./fixtures/merged-rules');
const testHelper = require('./pages/test-helper');


describe('parser2', () => {
  let parser2;
  let document;
  beforeEach(() => {
    document = testHelper.getDocumetOfHtmlFile('test/pages/mozilla-blog.html');
    parser2 = new Parser2(document, testHelper.getMockConsole());
  });


  it.only('#findArticleContext', () => {
    const links = Array.from(document.querySelectorAll('.entry-header>A')).map(element => {return {element}});
    const contexts = parser2.findArticleContext(links, parser2.getDocumentRoot());
    expect(contexts[0].contextElementPath).to.eql('DIV>MAIN>DIV>ARTICLE');
  });

});
