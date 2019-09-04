const {expect} = require('chai');
const Parser = require('../app/parser');
const unmergedRules = require('./fixtures/unmerged-rules');

describe('parser', () => {
  let parser;
  beforeEach(() => {
    parser = new Parser(null, console);
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
    expect(mergedPath).to.eql('MAIN>DIV>SECTION>ARTICLE');
  });

  it.only('#mergeRules', () => {
    const merged = parser.mergeRules(unmergedRules);
    console.log(merged);
  });
});
