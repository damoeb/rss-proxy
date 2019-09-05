module.exports = [
  {
    rules: {
      article: 'MAIN>DIV.layout>SECTION>ARTICLE',
      articleTagName: 'ARTICLE',
      title: 'A.teaser-inner>HEADER>H1.teaser-title',
      description: 'A.teaser-inner>HEADER>P.teaser-subtitle',
      link: 'A'
    },
    stats: {
      articleCount: 117,
      avgTitleWordCount: 7.289940828402367,
      avgDescriptionWordCount: 16.597633136094675,
      titleDiffersDescription: true
    },
    ruleId: 'ARTICLE/A.teaser-inner>HEADER>H1.teaser-title/A.teaser-inner>HEADER>P.teaser-subtitle/A'
  },
  {
    rules: {
      article: 'MAIN>DIV.layout>SECTION',
      articleTagName: 'SECTION',
      title: 'ARTICLE>A.teaser-inner>HEADER>H1.teaser-title',
      description: 'ARTICLE>A.teaser-inner>HEADER>H1.teaser-title',
      link: 'HEADER>DIV>H1>A'
    },
    stats: {
      articleCount: 19,
      avgTitleWordCount: 7.289940828402367,
      avgDescriptionWordCount: 7.289940828402367,
      titleDiffersDescription: false
    },
    ruleId: 'SECTION/ARTICLE>A.teaser-inner>HEADER>H1.teaser-title/ARTICLE>A.teaser-inner>HEADER>H1.teaser-title/HEADER>DIV>H1>A'
  },
  {
    rules: {
      article: 'MAIN>DIV.layout>SECTION>ARTICLE',
      articleTagName: 'ARTICLE',
      title: 'A.teaser-inner>HEADER>P.teaser-subtitle',
      description: 'A.teaser-inner>HEADER>P.teaser-subtitle',
      link: 'A'
    },
    stats: {
      articleCount: 18,
      avgTitleWordCount: 17.428571428571427,
      avgDescriptionWordCount: 17.428571428571427,
      titleDiffersDescription: false
    },
    ruleId: 'ARTICLE/A.teaser-inner>HEADER>P.teaser-subtitle/A.teaser-inner>HEADER>P.teaser-subtitle/A'
  },
  {
    rules: {
      article: 'HEADER.site--header-next>DIV>SECTION.site-guide-next>DIV.js-site-portal-nav-root>DIV>NAV',
      articleTagName: 'NAV',
      title: 'DIV.hud-item>A>P',
      description: 'DIV.hud-item>A>P',
      link: 'DIV.hud-item>A'
    },
    stats: {
      articleCount: 4,
      avgTitleWordCount: 4.8,
      avgDescriptionWordCount: 4.8,
      titleDiffersDescription: false
    },
    ruleId: 'NAV/DIV.hud-item>A>P/DIV.hud-item>A>P/DIV.hud-item>A'
  }
];
