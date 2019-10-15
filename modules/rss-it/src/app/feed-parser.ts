interface ElementWithPath {
  element: HTMLElement;
  path: string;
}

interface ArticleRule extends PartialArticlesWithDescription {
  score: number
}

interface PartialArticlesWithStructure {
  articles: Array<ArticleContext>;
  commonTextNodePath: Array<string>;
  notcommonTextNodePath: Array<string>;
  structureSimilarity: number
}

interface Stats {
  title: any;
  description?: any;
}

interface StatsWrapper {
  stats: Stats
}

interface Article {
  title: string;
  link: string;
  description?: Array<string>;
}

interface PartialArticlesWithTitle extends PartialArticlesWithStructure, StatsWrapper {
  path: string;
  linkPath: string;
  titlePath: string;
}

interface PartialArticlesWithDescription extends PartialArticlesWithTitle {

}

interface ArticleContext {
  linkElement: HTMLElement;
  contextElement: HTMLElement;
  contextElementPath: string
}

export class FeedParser {
  constructor(private document: HTMLDocument) {}


  private getDocumentRoot () : HTMLElement {
    return this.document.getElementsByTagName('body').item(0);
  }

  private getRelativePath (node: HTMLElement, context:HTMLElement, withClassNames=false) {
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

  private findLinks () : Array<HTMLElement> {
    return Array.from(this.document.getElementsByTagName('A')) as Array<HTMLElement>;
  }

  private findArticleContext (nodeElements: Array<ElementWithPath>, root: HTMLElement): Array<ArticleContext> {
    let currentNodes: Array<HTMLElement> = nodeElements.map(nodeElement => nodeElement.element);
    while (true) {
      let parentNodes = currentNodes.map(currentNode => currentNode.parentNode);
      // todo all parent nodes are the same
      if (parentNodes[0].isSameNode(parentNodes[1])) {
        break;
      }
      currentNodes = parentNodes as Array<HTMLElement>;
    }

    return nodeElements.map((nodeElement, index) => {
      const link = nodeElement.element;
      const context = currentNodes[index];
      return <ArticleContext> {
        linkElement: link,
        contextElement: context,
        contextElementPath: this.getRelativePath(context, root)
      }
    })
  }

  private toWords (text: string) : Array<string> {
    return text.trim().split(' ').filter(word => word.length > 0);
  }

  private textNodesUnder (el: HTMLElement): Array<HTMLElement> {
    const textNodes: Array<HTMLElement> = [];
    const walk = this.document.createTreeWalker(el, -1, null, false);
    let node;
    while ((node = walk.nextNode())) {
      if (node.cloneNode(false).textContent.trim().length > 0) {
        textNodes.push(node as HTMLElement); // fixme check
      }
    }
    return textNodes;
  }

  private findCommonTextNodes (articles: Array<ArticleContext>): PartialArticlesWithStructure {
    const referenceArticleNode = articles[0].contextElement;
    const textNodes = this.textNodesUnder(referenceArticleNode);

    const groupedTextNodes = textNodes
      .map(textNode => this.getRelativePath(textNode, referenceArticleNode))
      .reduce((map, pathToTextNode) => {
        // check every article contains the path
        const existsEverywhere = articles.every(article => {
          const resolvedTextNode = article.contextElement.querySelector(pathToTextNode);
          // article.commonTextNodes.push(resolvedTextNode);
          return !pathToTextNode || resolvedTextNode !== null;
        });

        if (existsEverywhere) {
          map.common.push(pathToTextNode);
        } else {
          map.notCommon.push(pathToTextNode);
        }
        return map;

      }, {common: [], notCommon: []});

    return {
      articles,
      commonTextNodePath: this.uniq(groupedTextNodes.common),
      notcommonTextNodePath: this.uniq(groupedTextNodes.notCommon)
        .filter((notCommonPath: string) => !groupedTextNodes.common.some((commonPath: string) => notCommonPath.startsWith(commonPath))),
      structureSimilarity: groupedTextNodes.common.length / textNodes.length
    };
  }

  private getTagName (node: HTMLElement, withClassNames: boolean): string {
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

  private uniq (list: Array<string>): Array<string> {
    return list.reduce((uniqList, item) => {

      if (uniqList.indexOf(item) === -1) {
        uniqList.push(item);
      }

      return uniqList;
    }, [])
  }

  private findTitle (group: PartialArticlesWithStructure): PartialArticlesWithTitle {
    const referenceArticle = group.articles[0];
    const sortedTitleNodePaths = group.commonTextNodePath.map((textNodePath) => {
      const wordsOfNode = group.articles
        .map(article => {
          const otherTextNode = article.contextElement.querySelector(textNodePath);
          return this.toWords(otherTextNode.textContent);
        });
      const words = wordsOfNode.flat(1);
      const variance = this.uniq(words).length / words.length;

      const totalWordCountSum = wordsOfNode.map(words => words.length).reduce((sum, wordCount) => sum + wordCount, 0);
      const avgWordCount = totalWordCountSum / wordsOfNode.length;

      return {variance, avgWordCount, textNodePath};
    })
      .filter((d) => {
        return d.avgWordCount > 3;
      })
      .sort((a, b) => {
        return b.variance - a.variance;
      })
      .map(complexNode => complexNode.textNodePath);

    if (sortedTitleNodePaths.length === 0) {
      throw new Error('No textNode found that looks like a title');
    }

    const titlePath = sortedTitleNodePaths[0];
    return {
      stats: {title: titlePath},
      articles: group.articles,
      structureSimilarity: group.structureSimilarity,
      path: referenceArticle.contextElementPath,
      linkPath: this.getRelativePath(referenceArticle.linkElement, referenceArticle.contextElement),
      titlePath,
      commonTextNodePath: group.commonTextNodePath.filter(path => path !== titlePath),
      notcommonTextNodePath: group.notcommonTextNodePath
    }
  }

  private findDescription (group: PartialArticlesWithTitle): PartialArticlesWithDescription {
    // avg word count
    const articleWords = group.articles.map(article => {
      return group.commonTextNodePath
        .map(path => Array.from(article.contextElement.querySelectorAll(path))
          .map(textNode => textNode.textContent)
        )
        .flat(1)
        .map(text => this.toWords(text))
        .flat(1);
    });

    const totalWordCount = articleWords.reduce((sum, articleWords) => {
      return sum + articleWords.length;
    }, 0);
    group.stats.description = {
      variance: this.uniq(articleWords.flat(1)).length / articleWords.flat(1).length,
      avgWordCount: totalWordCount / group.articles.length
    };
    return group;
  }

  public getArticleRules (): Array<ArticleRule> {
    const body = this.getDocumentRoot();
    const linkElements: Array<ElementWithPath> = this.findLinks()
      .filter(element => this.toWords(element.textContent).length > 3)
      .map(element => {
        return {
          element,
          path: this.getRelativePath(element, body)
        };
      });

    const linksGroupedByPath = linkElements.reduce((groups, linkPath) => {
      if (!groups[linkPath.path]) {
        groups[linkPath.path] = [];
      }
      groups[linkPath.path].push(linkPath);
      return groups;
    }, {} as any);

    const relevantGroups: Array<PartialArticlesWithDescription> = (Object.values(linksGroupedByPath) as Array<Array<ElementWithPath>>)
      .filter(linkElements => linkElements.length > 3)
      .map(linkElements => this.findArticleContext(linkElements, body))
      // find shared text nodes
      .map(articlesInGroup => this.findCommonTextNodes(articlesInGroup))
      // find title: title is the first text node that has in avg 3+ words and is wrapped by the link
      .map(articlesInGroup => this.findTitle(articlesInGroup))
      // find description
      .map(articlesInGroup => this.findDescription(articlesInGroup));

    return relevantGroups
      .map(group => {

        const rule = group as ArticleRule;

        rule.score = group.stats.title.variance * group.stats.title.avgWordCount +
          group.stats.description.variance * group.stats.description.avgWordCount;

        return rule;
      })
      .sort((a, b) => b.score - a.score);
  }

  public getArticles (): Array<Article> {

    const rules = this.getArticleRules();
    const bestRule = rules[0];
    return Array.from(this.document.querySelectorAll(bestRule.path)).map(element => {
      try {
        return {
          title: element.querySelector(bestRule.titlePath).textContent.trim(),
          link: element.querySelector(bestRule.linkPath).getAttribute('href'),
          description: bestRule.commonTextNodePath.map(textNodePath => {
            return Array.from(element.querySelectorAll(textNodePath)).map(textNode => textNode.textContent.trim());
          })
            .flat(1)
            .filter(text => text.length > 2)
        }
      } catch (err) {
        return undefined;
      }
    }).filter(article => article)
  }
}
