export interface LinkPointer {
  element: HTMLElement;
  path: string;
}

export interface ArticleRule extends PartialArticlesWithDescription {
  score: number;
}

export interface RawArticleRule {
  contextElementPath: string;
  linkPath: string;
}

export interface PartialArticlesWithStructure {
  id: string;
  articles: ArticleContext[];
  commonTextNodePath: string[];
  rule: RawArticleRule;
}

export interface TitleFeatures {
  variance: number;
  avgWordLength: number;
  hasHeaderInPath: boolean;
}

export interface TitleRule {
  features: TitleFeatures;
  textNodePath: string;
  score?: number;
}

export interface DescriptionFeatures {
  variance: number;
  avgWordCount: number;
}

export interface DescriptionRule {
  features: DescriptionFeatures;
  useCommonPaths: boolean;
}

export interface Stats {
  title: TitleRule;
  description?: DescriptionRule;
}

export interface StatsWrapper {
  stats: Stats;
}

export interface Article {
  title: string;
  link: string;
  summary?: string[];
  context?: string;
}

export interface PartialArticlesWithTitle extends PartialArticlesWithStructure, StatsWrapper {
  linkPath: string;
  titlePath: string;
}

export interface PartialArticlesWithDescription extends PartialArticlesWithTitle {
  dummy?: boolean;
}

export interface ArticleContext {
  linkElement: HTMLElement;
  id: string;
  // root of article
  contextElement: HTMLElement;
}

export interface LinkGroup {
  links: LinkPointer[];
}

export class FeedParser {
  constructor(private document: HTMLDocument) {
  }


  private getDocumentRoot(): HTMLElement {
    return this.document.getElementsByTagName('body').item(0);
  }

  private getRelativePath(node: HTMLElement, context: HTMLElement, withClassNames = false) {
    let path = node.tagName; // tagName for text nodes is undefined
    while (node.parentNode !== context) {
      node = node.parentNode as HTMLElement;
      if (typeof (path) === 'undefined') {
        path = this.getTagName(node, withClassNames);
      } else {
        path = `${this.getTagName(node, withClassNames)}>${path}`;
      }
    }
    return path;
  }

  private findLinks(): HTMLElement[] {
    return Array.from(this.document.getElementsByTagName('A')) as HTMLElement[];
  }

  private findArticleRootElement(currentElement: HTMLElement[]): HTMLElement[] {
    while (true) {
      const parentNodes = currentElement.map(currentNode => currentNode.parentNode);
      // todo all parent nodes are the same
      if (parentNodes[0].isSameNode(parentNodes[1])) {
        break;
      }
      currentElement = parentNodes as HTMLElement[];
    }
    return currentElement;
  }

  private findArticleContext(linkGroup: LinkGroup, root: HTMLElement, index: number): ArticleContext[] {
    const linkPointers = linkGroup.links;
    const linkElements = linkPointers.map((nodeElement: LinkPointer) => nodeElement.element);
    const articleRootElements = this.findArticleRootElement(linkElements);

    const id = linkPointers[0].path;
    console.log(`context #${index} group ${id} ${this.getRelativePath(articleRootElements[0], root, false)}`);

    return linkPointers.map((linkPointer, linkPointerIndex) => {
      const linkElement = linkPointer.element;
      const contextElement = articleRootElements[linkPointerIndex];

      const articleContext: ArticleContext = {
        id,
        linkElement,
        contextElement,
      };
      return articleContext;
    });
  }

  private toWords(text: string): string[] {
    return text.trim().split(' ').filter(word => word.length > 0);
  }

  public findTextNodesInContext(context: HTMLElement): HTMLElement[] {
    const textNodes: HTMLElement[] = [];
    const walk = this.document.createTreeWalker(context, -1, null, false);
    while (true) {
      const node = walk.nextNode();

      if (!node) {
        break;
      }

      const isTextNode = node.cloneNode(false).textContent.trim().length > 0;
      const moreGeneralParentIsAlreadyPushed = textNodes.indexOf(node.parentElement) > -1;
      if (isTextNode && !moreGeneralParentIsAlreadyPushed) {
        textNodes.push(node as HTMLElement);
      }
    }

    return textNodes;
  }

  private findCommonTextNodes(articles: ArticleContext[], root: HTMLElement, index: number): PartialArticlesWithStructure {

    const referenceArticle = articles[0];
    const referenceArticleNode = referenceArticle.contextElement;
    console.log(`common-nodes #${index} for ${referenceArticle.id}`);

    const textNodes = this.findTextNodesInContext(referenceArticleNode);

    const commonTextNodes = textNodes
      .map(textNode => this.getRelativePath(textNode, referenceArticleNode))
      .filter((pathToTextNode) => {
        // check every article contains the path
        const frequency = articles.filter(article => {
          const resolvedTextNode = article.contextElement.querySelector(pathToTextNode);
          // article.commonTextNodes.push(resolvedTextNode);
          return !pathToTextNode || resolvedTextNode !== null;
        }).length / articles.length;

        if (frequency >= 0.7) {
          console.log(`+ ${ pathToTextNode } common node, frequency= ${ frequency * 100 }%`);
          return true;
        } else {
          console.log(`- ${ pathToTextNode } not a common node,frequency= ${ frequency * 100 }%`);
          return false;
        }
      });

    try {
      return {
        id: referenceArticle.id,
        articles,
        rule: {
          linkPath: this.getRelativePath(referenceArticle.linkElement, referenceArticle.contextElement),
          contextElementPath: this.getRelativePath(referenceArticle.contextElement, root)
        },
        commonTextNodePath: commonTextNodes.filter(this.onlyUnique),
      };
    } catch (e) {
      console.log(`Dropping ${referenceArticle.id}`);
      console.error(e);
      return null;
    }
  }

  private getTagName(node: HTMLElement, withClassNames: boolean): string {
    if (!withClassNames) {
      return node.tagName;
    }
    const classList = Array.from(node.classList)
      .filter(cn => cn.match('[0-9]+') === null);
    if (classList.length > 0) {
      return `${node.tagName}.${classList.join('.')}`;
    }
    return node.tagName;
  }

  private uniq(list: string[]): string[] {
    return list.reduce((uniqList, item) => {

      if (uniqList.indexOf(item) === -1) {
        uniqList.push(item);
      }

      return uniqList;
    }, []);
  }

  private findTitles(group: PartialArticlesWithStructure, index: number): PartialArticlesWithTitle {
    try {

      console.log(`title #${index} for #${group.id}`);

      // todo common path should use index or classes
      const sortedTitleNodes: TitleRule[] = group.commonTextNodePath.map((textNodePath) => {
        return {features: this.getTitleFeatures(group, textNodePath), textNodePath} as TitleRule;
      })
        .map((title) => {
          // score
          title.score = (title.features.avgWordLength > 3 ? 1 : 0)
          + (title.features.hasHeaderInPath ? 1 : 0)
          + title.features.variance;
          return title;
        })
        .sort((a, b) => {
          return b.score - a.score;
        });

      const referenceArticle = group.articles[0];

      if (sortedTitleNodes.length === 0) {
        console.log(`Drop ${group.id} - no titles found`);
        // throw new Error('No textNode found that looks like a title');
        return null;
      }

      const titlePath = sortedTitleNodes[0];
      console.log(`group ${group.id} has title ${titlePath.textNodePath}`);

      return {
        id: group.id,
        stats: {title: titlePath},
        articles: group.articles,
        rule: group.rule,
        linkPath: this.getRelativePath(referenceArticle.linkElement, referenceArticle.contextElement),
        titlePath: titlePath.textNodePath,
        commonTextNodePath: group.commonTextNodePath.filter(path => path && path !== titlePath.textNodePath),
      };
    } catch (e) {
      console.error('Cannot extract title', e);
      return null;
    }
  }

  public onlyUnique(value: string, index: number, self: string[]) {
    return self.indexOf(value) === index;
  }

  public filterSubpath(value: string, index: number, self: string[]) {
    return self.indexOf(value) === index;
  }

  private findDescriptions(group: PartialArticlesWithTitle): PartialArticlesWithDescription {
    group.stats.description = {
      features: this.getDescriptionFeatures(group),
      useCommonPaths: true
    };
    group.commonTextNodePath = group.commonTextNodePath
      .filter(textPath => !textPath.startsWith(group.titlePath))
      // .sort((a, b) => a.length - b.length)
      .reduce((commonTextNodePaths, textNodePath) => {

        if (!textNodePath.endsWith('A') && !commonTextNodePaths.some(commonTextNodePath => textNodePath.startsWith(commonTextNodePath))) {
          commonTextNodePaths.push(textNodePath);
        }

        return commonTextNodePaths;
      }, []);
    return group;
  }

  public getArticleRules(): ArticleRule[] {

    const body = this.getDocumentRoot();

    // find links
    const linkElements: LinkPointer[] = this.findLinks()
      .filter(element => this.toWords(element.textContent).length > 3)
      .map(element => {
        return {
          element,
          path: this.getRelativePath(element, body)
        };
      });

    // group links with similar path in document
    const linksGroupedByPath = linkElements.reduce((linksGroup, linkPath) => {
      if (!linksGroup[linkPath.path]) {
        linksGroup[linkPath.path] = {links: []};
      }
      linksGroup[linkPath.path].links.push(linkPath);
      return linksGroup;
    }, {} as any);


    const groups: Array<LinkGroup> = Object.values(linksGroupedByPath);

    console.log(`${groups.length} link groups`);

    const relevantGroups: PartialArticlesWithDescription[] = groups
      .filter((linkGroup, index) => {
        const hasEnoughMembers = linkGroup.links.length > 3;

        if (hasEnoughMembers) {
          console.log(`size #${index} keep ${linkGroup.links[0].path} - ${linkGroup.links.length} member`);
        } else {
          console.log(`size #${index} drop ${linkGroup.links[0].path} - ${linkGroup.links.length} member`);
        }

        return hasEnoughMembers;
      })
      .map((linkGroup, index) => this.findArticleContext(linkGroup, body, index))
      .map((articlesInGroup, index) => this.findCommonTextNodes(articlesInGroup, body, index))
      .filter(value => value)
      // find title: title is the first text node that has in avg 3+ words and is wrapped by the link
      .map((articlesInGroup, index) => this.findTitles(articlesInGroup, index))
      .filter(value => value)
      // find description
      .map(articlesInGroup => this.findDescriptions(articlesInGroup));


    console.log(`${relevantGroups.length} article rules`);
    relevantGroups.forEach(group => console.log(group.id));

    return relevantGroups
      .map(group => {

        const rule = group as ArticleRule;

        rule.score = group.stats.title.features.variance * group.stats.title.features.avgWordLength +
          group.stats.description.features.variance * group.stats.description.features.avgWordCount;

        return rule;
      })
      .sort((a, b) => b.score - a.score);
  }

  public getArticles(): Article[] {

    const rules = this.getArticleRules();
    const bestRule = rules[0];
    return this.getArticlesByRule(bestRule);
  }

  public getArticlesByRule(rule: ArticleRule): Article[] {

    return Array.from(this.document.querySelectorAll(rule.rule.contextElementPath)).map(element => {
      try {
        const titles = Array.from(element.querySelectorAll(rule.titlePath)).map(node => node.textContent.trim());
        const link = element.querySelector(rule.linkPath).getAttribute('href');
        if (titles.length === 0  || titles.join('').trim().length === 0 || !link) {
          return undefined;
        }

        const article: Article = {
          title: titles.join(' / '),
          link,
          context: element.outerHTML,
          summary: rule.commonTextNodePath.map(textNodePath => {
            return Array.from(element.querySelectorAll(textNodePath))
              .map(textNode => textNode.textContent.trim());
          })
            .flat(1)
            .filter(this.onlyUnique)
            .filter(text => text.split(' ').length > 5)
        };
        return article;
      } catch (err) {
        return undefined;
      }
    }).filter(article => article);
  }

  private getTitleFeatures(group: PartialArticlesWithStructure, textNodePath: string): TitleFeatures {
    const wordsInTitles = group.articles
      .map(article => {
        const otherTextNode = article.contextElement.querySelector(textNodePath);
        if (!otherTextNode) {
          return [];
        }
        return this.toWords(otherTextNode.textContent);
      });
    const words = wordsInTitles.flat(1);
    const variance = words.filter(this.onlyUnique).length / Math.max(words.length, 1);

    const totalWordLengthSum = wordsInTitles.map(wordsInTitle => wordsInTitle.length).reduce((sum, wordCount) => sum + wordCount, 0);
    const avgWordLength = totalWordLengthSum / wordsInTitles.length;

    return {variance, avgWordLength, hasHeaderInPath: /h[0-9]|header/i.test(textNodePath)};
  }

  private getDescriptionFeatures(group: PartialArticlesWithTitle) {
    // todo exclude title
    const articleWords = group.articles.map(article => {
      return group.commonTextNodePath
        .map(path => Array.from(article.contextElement.querySelectorAll(path))
          .map(textNode => textNode.textContent)
        )
        .flat(1)
        .map(text => this.toWords(text))
        .flat(1);
    });

    const totalWordCount = articleWords.reduce((sum, words) => {
      return sum + words.length;
    }, 0);

    return {
      variance: this.uniq(articleWords.flat(1)).length / Math.max(articleWords.flat(1).length, 1),
      avgWordCount: totalWordCount / group.articles.length
    };
  }
}
