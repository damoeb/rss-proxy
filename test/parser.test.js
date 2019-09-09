const {expect} = require('chai');
const Parser = require('../app/parser');
const unmergedRules = require('./fixtures/unmerged-rules');
const mergedRules = require('./fixtures/merged-rules');
const testHelper = require('./pages/test-helper');


describe('parser', () => {
  let parser;
  beforeEach(() => {
    parser = new Parser(null, testHelper.getMockConsole());
  });

  it('#mergePath', () => {
    const mergedPath = parser.mergePaths([
      'MAIN>DIV.layout>SECTION>ARTICLE',
      'MAIN>DIV.layout>SECTION.theme-diskurs>ARTICLE',
      'MAIN>DIV.layout>SECTION.theme-web>ARTICLE',
      'MAIN>DIV.layout>SECTION.theme-international>ARTICLE',
      'MAIN>DIV.layout>SECTION.theme-inland>ARTICLE',
      'MAIN>DIV.layout>SECTION.theme-sport>ARTICLE',
      'MAIN>DIV.layout>SECTION.theme-lifestyle>ARTICLE',
      'MAIN>DIV.layout>SECTION.theme-kultur>ARTICLE',
      'MAIN>DIV.layout>SECTION.theme-etat>ARTICLE',
      'MAIN>DIV.layout>SECTION.theme-wissenschaft>ARTICLE',
      'MAIN>DIV.layout>SECTION.theme-diestandard>ARTICLE',
      'MAIN>DIV.layout>SECTION.theme-gesundheit>ARTICLE',
      'MAIN>DIV.layout>SECTION.theme-videosection>ARTICLE',
      'MAIN>DIV.layout>SECTION.theme-zukunft>ARTICLE']);
    expect(mergedPath).to.eql('MAIN>DIV.layout>SECTION>ARTICLE');
  });

  it('#mergeRules', () => {
    const merged = parser.mergeRules(unmergedRules);
    expect(merged).to.eql(mergedRules);
  });

  describe('text-nodes', () => {

    let textNodes;
    let root;

    beforeEach(() => {
      const document = testHelper.getDocumetOfHtmlFile('test/fixtures/nested-text-nodes.html');
      root = document.querySelector('body');
      textNodes = parser.findTextNodes(root);
    });

    it('#findTextNodes', () => {
      expect(textNodes.length).to.eql(41);
    });

    it('#findCommonParent', () => {
      expect(parser.findCommonParentPath(textNodes, root)).to.eql('DIV.post-body');
    });

  });
});
