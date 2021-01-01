

export interface FeedUrl {
  name: string;
  url: string;
}

export interface LinkPointer {
  element: HTMLElement;
  path: string;
}

export interface ArticleRule {
  hidden?: boolean;
  count?: number;
  score?: number;
  contexts?: ArticleContext[];
  linkXPath: string;
  contextXPath: string;
  id: string;
}

export enum OutputType {
  JSON = 'JSON', RSS = 'RSS', ATOM = 'ATOM'
}

export enum SourceType {
  STATIC = 'STATIC', WITH_SCRIPTS = 'WITH_SCRIPTS'
}

export enum ContentResolutionType {
  STATIC = 'STATIC', DEEP = 'DEEP'
}

export interface SimpleFeedResult {
  feed?: any;
}
export interface FeedParserResult extends SimpleFeedResult {
  usesExistingFeed: boolean;
  feeds?: FeedUrl[];
  message?: string;
  logs: string[];
  options: FeedParserOptions;
  rules: ArticleRule[];
  html: string;
  feedOutputType?: OutputType,
  feed?: any;
  articles: Article[];
}

export interface FeedParserOptions {
  output: OutputType;
  rule?: string,
  excludeItemsThatContainOneOf?: string,
  excludeBrokenItems?: boolean
}

export interface TitleFeatures {
  variance: number;
  avgWordLength: number;
  hasHeaderInPath: boolean;
}

export interface Article {
  title: string;
  link: string;
  summary?: string[];
  content?: string;
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

export interface Logger {
  log: (...params:any[]) => void
  error: (...params:any[]) => void
}

export class FeedParser {

  private readonly url: URL;
  private readonly minLinkGroupSize = 2;
  private readonly minWordCountOFLink: number = 1;

  constructor(private document: HTMLDocument,
              url: string,
              private options: FeedParserOptions,
              private logger: Logger) {
    this.url = new URL(url);
  }


  private getDocumentRoot(): HTMLElement {
    return this.document.getElementsByTagName('body').item(0);
  }

  private static getRelativeXPath(element: HTMLElement, context: HTMLElement): string {
    if (element.id !== '')
      return "//*[@id='"+element.id+"']";

    if (element === context)
      return '//' + element.tagName.toLowerCase();

    let ix = 0;
    const siblings = element.parentElement.children;
    for (let i = 0; i < siblings.length; i ++) {
      const sibling = siblings[i];

      if (sibling === element) {
        return `${this.getRelativeXPath(element.parentElement, context)}/${element.tagName.toLowerCase()}[${ix + 1}]`;
      }

      if (sibling.nodeType===1 && sibling.tagName === element.tagName) {
        ix++;
      }
    }
  }

  public static getRelativePath(node: HTMLElement, context: HTMLElement, withClassNames = false) {
    if (node.nodeType === 3 || node === context) {
      // todo mag this is not applicable
      return 'self';
    }
    let path = node.tagName; // tagName for text nodes is undefined
    while (node.parentNode !== context) {
      node = node.parentNode as HTMLElement;
      if (typeof (path) === 'undefined') {
        path = FeedParser.getTagName(node, withClassNames);
      } else {
        path = `${FeedParser.getTagName(node, withClassNames)}>${path}`;
      }
    }
    return path;
  }

  private findLinks(): HTMLElement[] {
    return Array.from(this.document.getElementsByTagName('A')) as HTMLElement[];
  }

  private findArticleRootElement(linkElements: HTMLElement[]): HTMLElement[] {
    while (true) {
      const parentNodes = linkElements.map(currentNode => currentNode.parentElement);
      if (!parentNodes || parentNodes.length === 0) {
        break;
      }
      if (parentNodes[0].isSameNode(parentNodes[1])) {
        break;
      }
      linkElements = parentNodes as HTMLElement[];
    }
    return linkElements;
  }

  private findArticleContext(linkGroup: LinkGroup): ArticleContext[] {
    const linkPointers = linkGroup.links;
    const linkElements = linkPointers.map((nodeElement: LinkPointer) => nodeElement.element);
    const articleRootElements = this.findArticleRootElement(linkElements);

    const id = linkPointers[0].path;
    // this.logger.log(`context #${index} group ${id} ${this.getRelativePath(articleRootElements[0], root, false)}`);

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

  static toWords(text: string): string[] {
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

  private static getTagName(node: HTMLElement, withClassNames: boolean): string {
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

  private static uniq(list: string[]): string[] {
    return list.reduce((uniqList, item) => {

      if (uniqList.indexOf(item) === -1) {
        uniqList.push(item);
      }

      return uniqList;
    }, []);
  }

  private uniqueArticles(value: Article, index: number, self: Article[]) {
    return self.indexOf(self.find(article => article.link === value.link)) === index;
  }

  public getArticleRules(): ArticleRule[] {

    const body = this.getDocumentRoot();

    // find links
    const linkElements: LinkPointer[] = this.findLinks()
      .filter(element => FeedParser.toWords(element.textContent).length >= this.minWordCountOFLink)
      .map(element => {
        return {
          element,
          path: FeedParser.getRelativePath(element, body, true)
        };
      });

    // group links with similar path in document
    const linksGroupedByPath = linkElements.reduce((linkGroup, linkPath) => {
      if (!linkGroup[linkPath.path]) {
        linkGroup[linkPath.path] = {links: []};
      }
      linkGroup[linkPath.path].links.push(linkPath);
      return linkGroup;
    }, {} as any);


    const groups: Array<LinkGroup> = Object.values(linksGroupedByPath);

    this.logger.log(`Found ${groups.length} link groups`);

    // todo merge rules that just have a different context

    this.logger.log(`Dropping irrelevant link-groups with less than ${this.minLinkGroupSize} members`);
    const articleRules: ArticleRule[] = groups
      .filter(linkGroup => {
        const hasEnoughMembers = linkGroup.links.length >= this.minLinkGroupSize;

        if (!hasEnoughMembers) {
          this.logger.log(`Dropping link-group ${linkGroup.links[0].path}, cause it is too small (${linkGroup.links.length})`);
        }

        return hasEnoughMembers;
      })
      .map(linkGroup => this.findArticleContext(linkGroup))
      .filter(value => value)
      .map(contexts => this.convertContextsToRule(contexts, body))


    this.logger.log(`${articleRules.length} article rules left`);
    articleRules.forEach(group => this.logger.log(group.id));

    const words = (text: string) => text.split(' ').filter(word => word.length > 0);

    return articleRules
      .map(rule => {

        const contextPathContains = (s: string) => rule.contextXPath.toLowerCase().indexOf(s.toLowerCase()) > -1;
        const linkPathContains = (s: string) => rule.linkXPath.toLowerCase().indexOf(s.toLowerCase()) > -1;
        const texts = rule.contexts.map(context => context.contextElement.textContent || '');
        const linkElementsPerContext = rule.contexts.map(context => Array.from(context.contextElement.querySelectorAll('a[href]')));
        const linksPerContext = linkElementsPerContext.map(linkElements => FeedParser.uniq(linkElements.map((elem:any) => elem.getAttribute('href'))))
        let score = 0;
        if (contextPathContains('header')) score -= 2;
        if (contextPathContains('nav')) score --;
        if (contextPathContains('article')) score += 2;
        if (contextPathContains('main')) score += 2;
        if (contextPathContains('aside')) score -= 2;
        if (contextPathContains('footer')) score -= 2;
        if (contextPathContains('ul>li')) score --;
        if (linkPathContains('h1')) score += 4;
        if (linkPathContains('h2')) score += 3;
        if (linkPathContains('h3')) score += 2;
        if (linkPathContains('h4')) score ++;
        if (linkPathContains('strong')) score ++;
        if (linkPathContains('aside')) score --;
        if (linkPathContains('article')) score += 2;
        // if (rule.linkPath.toLowerCase() === 'a') score --;
        if (rule.contextXPath.toLowerCase().endsWith('a')) score -= 5;
        if (rule.linkXPath.toLowerCase() === 'self') score --;

        // punish multiple links elements
        score = score - this.avg(linkElementsPerContext.map(linkElements => linkElements.length)) + 1;
        // punish multiple links
        score = score - this.avg(linksPerContext.map(links => links.length)) + 1;
        if (this.median(texts.map(text => words(text).length)) < 3) score -= 10;
        if (this.median(texts.map(text => text.length)) > 150) score += 2;
        if (this.median(texts.map(text => text.length)) > 450) score += 4;
        if (this.median(texts.map(text => text.length)) > 450) score += 1;
        if (texts.some(text => text.length < 50)) score --;
        if (rule.contexts.length < 3) score --;
        if (rule.contexts.length > 5) score ++;
        if (rule.contexts.length > 10) score ++;

        rule.score = score;

        return rule;
      })
      .reduce((rules, rule) => {
        const similarRule = rules.find((otherRule: ArticleRule) => otherRule.contextXPath === rule.contextXPath)
        if (similarRule) {
          similarRule.score += 3;
        } else {
          rules.push(rule);
        }

        // /a/b
        // /a
        const subRules = rules.filter((extendedRule: ArticleRule) => {
          return extendedRule.contextXPath.startsWith(rule.contextXPath);
        });
        rule.score -= subRules.length;
        rules.filter((superRule: ArticleRule) => {
          return rule.contextXPath.startsWith(superRule.contextXPath);
        })
          .forEach((superRule: ArticleRule) => {
          superRule.score --;
        });

        return rules;
      }, [])
      .sort((a, b) => b.score - a.score);
  }

  private avg(values: number[]){
    return values.reduce((sum, count) => {
      return sum + count;
    }, 0) / values.length;
  }

  private median(values: number[]){
    if(values.length ===0) return 0;

    values.sort((a,b) => a-b );

    const half = Math.floor(values.length / 2);

    if (values.length % 2) {
      return values[half];
    }

    return (values[half - 1] + values[half]) / 2.0;
  }

  public getArticles(): Article[] {

    const rules = this.getArticleRules();
    if (rules.length === 0) {
      throw new Error('No rules available')
    }
    const bestRule = rules[0];
    return this.getArticlesByRule(bestRule);
  }

  public getArticlesByRule(rule: ArticleRule): Article[] {

    this.logger.log('apply rule', rule.id);

    return FeedParser.evaluateXPath(rule.contextXPath, this.document.body, this.document)
      .map(element => {
        try {
          const link = FeedParser.evaluateXPath(rule.linkXPath, element, this.document)[0];
          const linkText = link.textContent;
          const href = link.getAttribute('href');
          const article: Article = {
            title: linkText,
            link: FeedParser.toAbsoluteUrl(this.url, href),
            content: element.outerHTML,
          };

          if (!FeedParser.qualifiesAsArticle(element, rule, this.document)) {
            return undefined;
          }

          return article;
        } catch (err) {
          return undefined;
        }
      })
      .filter(article => article);
  }

  public static toAbsoluteUrl(url: URL, link: string) {
    if (link.endsWith('//')) {
      link = link.substring(0, link.length-1);
    }
    if (link.startsWith('http://') || link.startsWith('https://')) {
      return link;
    }
    if (link.startsWith('//')) {
      return `${url.protocol}${link}`;
    }
    if (link.startsWith('/')) {
      return `${url.origin}${link}`;
    }
    return `${url.origin}/${link}`;
  }

  // private static querySelector(contextElement: HTMLElement, pathToTextNode: string): HTMLElement {
  //   return pathToTextNode === 'self' ? contextElement : contextElement.querySelector(pathToTextNode);
  // }

  // private static querySelectorAll(contextElement: HTMLElement, pathToTextNode: string): HTMLElement[] {
  //   return pathToTextNode === 'self' ? [contextElement] : Array.from(contextElement.querySelectorAll(pathToTextNode));
  // }

  private convertContextsToRule(contexts: ArticleContext[], root: HTMLElement): ArticleRule {
    const referenceArticle = contexts[0];
    return {
      count: contexts.length,
      score: 0,
      contexts,
      linkXPath: FeedParser.fixLinkXPath(FeedParser.getRelativeXPath(referenceArticle.linkElement, referenceArticle.contextElement)),
      contextXPath: FeedParser.generalizeContextXPath(contexts, root),
      id: contexts[0].id
    };
  }

  private static evaluateXPath(xPath: string, context: HTMLElement | Document, document: Document): HTMLElement[] {
    const xpathResult = document.evaluate(xPath, context, null, 5);
    const nodes: HTMLElement[] = [];
    let node = xpathResult.iterateNext();
    while (node) {
      nodes.push(node as HTMLElement);
      node = xpathResult.iterateNext();
    }
    return nodes;
  }

  /**
   * drops the last index if available
   */
  private static generalizeContextXPath(contexts: ArticleContext[], root: HTMLElement): string {
    return this.generalizeXPaths(contexts.map(context => FeedParser.getRelativeXPath(context.contextElement, root)));
  }

  public static qualifiesAsArticle(elem: HTMLElement, rule: ArticleRule, document: Document): boolean {
    if (elem.textContent.replace(/[\r\n\t ]+/g, '').length === 0) {
      return false;
    }
    const links = this.evaluateXPath(rule.linkXPath, elem, document);
    if (links.length === 0) {
      return false;
    }
    return true;
  }

  private static fixLinkXPath(xpath: string) {
    return xpath.replace(/\/\/[a-z]+/, '.');
  }

  public static generalizeXPaths(xpaths: string[]): string {
    const tokenized = xpaths.map(xpath => xpath.split('/')
      .map(p => {
        const match = /([^\[]+)\[([0-9]+)\]?/g.exec(p);
        if (match) {
          return {
            p,
            match: {
              path: match[1],
              index: match[2]
            }
          }
        } else {
          return {p}
        }
      })
    );
    const templateXPath = tokenized[0].map((pathToken, index) => {
      if (pathToken.match) {
        const changingIndex = tokenized.some(tokens => !tokens[index].match || tokens[index].match.index !== pathToken.match.index)
        if (changingIndex) {
          return pathToken.match.path
        } else {
          return `${pathToken.match.path}[${pathToken.match.index}]`
        }
      } else {
        return pathToken.p
      }
    });

    return templateXPath.join('/');
  }
}
