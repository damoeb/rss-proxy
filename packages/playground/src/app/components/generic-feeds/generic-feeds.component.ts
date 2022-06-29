import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  GenericFeedRule,
  GenericFeedWithParams,
} from '../../services/feed.service';
import * as URI from 'urijs';
import { clone } from 'lodash';

interface ArticleCandidate {
  elem: HTMLElement;
  index: number;
  qualified: boolean;
}

function getRelativeCssPath(
  node: HTMLElement,
  context: HTMLElement,
  withClassNames = false,
): string {
  if (node.nodeType === 3 || node === context) {
    // todo mag this is not applicable
    return 'self';
  }
  let path = node.tagName; // tagName for text nodes is undefined
  while (node.parentNode !== context) {
    node = node.parentNode as HTMLElement;
    if (typeof path === 'undefined') {
      path = getTagName(node, withClassNames);
    } else {
      path = `${getTagName(node, withClassNames)}>${path}`;
    }
  }
  return path;
}

export function patchHtml(html: string, url: string): Document {
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const base = doc.createElement('base');
  base.setAttribute('href', url);
  doc.getElementsByTagName('head').item(0).appendChild(base);

  Array.from(doc.querySelectorAll('[href]')).forEach((el) => {
    try {
      const absoluteUrl = new URI(el.getAttribute('href')).absoluteTo(url);
      el.setAttribute('href', absoluteUrl.toString());
    } catch (e) {
      // console.error(e);
    }
  });

  return doc;
}

function getTagName(node: HTMLElement, withClassNames: boolean): string {
  if (!withClassNames) {
    return node.tagName;
  }
  const classList = Array.from(node.classList).filter(
    (cn) => cn.match('[0-9]+') === null,
  );
  if (classList.length > 0) {
    return `${node.tagName}.${classList.join('.')}`;
  }
  return node.tagName;
}

@Component({
  selector: 'app-generic-feeds',
  templateUrl: './generic-feeds.component.html',
  styleUrls: ['./generic-feeds.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericFeedsComponent implements OnInit {
  @Input()
  prerendered: boolean;
  @Input()
  puppeteerScript: string;
  @Input()
  body: string;
  @Input()
  url: string;
  @Input()
  genericFeedRules: GenericFeedRule[];

  currentRule: GenericFeedWithParams;

  @ViewChild('iframeElement', { static: true })
  iframeRef: ElementRef;

  customDateXPath = '';
  customLinkXPath = '';
  customContextXPath = '';

  private proxyUrl: string;
  refine: boolean;
  hasChosen: boolean;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.prepareIframe(
      patchHtml(this.body, this.url).documentElement.innerHTML,
    );
  }

  applyCustomRule(currentRule: GenericFeedRule) {
    const customRule = clone(currentRule);
    customRule.id = 'custom';
    customRule.linkXPath = this.customLinkXPath;
    customRule.contextXPath = this.customContextXPath;
    customRule.dateXPath = this.customDateXPath;
    this.applyRule(customRule);
  }

  applyRule(rule: GenericFeedRule) {
    this.currentRule = {
      ...rule,
      harvestUrl: this.url,
      prerendered: this.prerendered,
      puppeteerScript: this.puppeteerScript,
    } as GenericFeedWithParams;
    this.customContextXPath = this.currentRule.contextXPath;
    this.customDateXPath = this.currentRule.dateXPath;
    this.customLinkXPath = this.currentRule.linkXPath;
    this.highlightRule(rule);
    this.changeDetectorRef.detectChanges();
  }

  private prepareIframe(html: string) {
    this.assignToIframe(html);
  }

  private assignToIframe(html: string) {
    this.proxyUrl = window.URL.createObjectURL(
      new Blob([html], {
        type: 'text/html',
      }),
    );
    this.iframeRef.nativeElement.src = this.proxyUrl;
    this.changeDetectorRef.detectChanges();
  }

  onIframeLoad(): void {
    // if (this.response.results.genericFeedRules) {
    // this.updateScores();
    // } else {
    // }
  }

  updateScores(): void {
    const iframeDocument = this.iframeRef.nativeElement.contentDocument;
    this.genericFeedRules.forEach((rule) => {
      const articles = this.evaluateXPathInIframe(
        rule.contextXPath,
        iframeDocument,
      )
        // remove hidden articles
        .filter((elem: any) => !!(elem.offsetWidth || elem.offsetHeight));
      // remove empty articles
      // .filter((elem: any) => elem.textContent.trim() > 0)
      // .filter((elem: any) => Array.from(elem.querySelectorAll(rule.linkPath)).length > 0);
      if (articles.length === 0) {
        rule.score -= 20;
        // rule.hidden = true;
      }
    });
    this.changeDetectorRef.detectChanges();
  }

  private highlightRule(rule: GenericFeedRule): void {
    const iframeDocument = this.iframeRef.nativeElement.contentDocument;
    const id = 'rss-proxy-style';

    try {
      iframeDocument.getElementById(id).remove();
    } catch (e) {}
    const styleNode = iframeDocument.createElement('style');
    styleNode.setAttribute('type', 'text/css');
    styleNode.setAttribute('id', id);
    const allMatches: HTMLElement[] = this.evaluateXPathInIframe(
      rule.contextXPath,
      iframeDocument,
    );

    const matchingIndexes = allMatches
      .map((elem) => {
        const index = Array.from(elem.parentElement.children).findIndex(
          (otherElem) => otherElem === elem,
        );
        // const qualified = true;
        // if (qualified) {
        //   console.log(`Keeping element ${index}`, elem);
        // } else {
        //   console.log(`Removing unqualified element ${index}`, elem);
        // }
        return { elem, index } as ArticleCandidate;
      })
      .map((candidate) => candidate.index);

    const cssSelectorContextPath =
      'body>' + getRelativeCssPath(allMatches[0], iframeDocument.body, false);
    console.log(cssSelectorContextPath);
    const code = `${matchingIndexes
      .map((index) => `${cssSelectorContextPath}:nth-child(${index + 1})`)
      .join(', ')} {
            border: 3px solid blue!important;
            margin: 2px!important;
            padding: 2px!important;
            display: block;
          }
          `;

    styleNode.appendChild(iframeDocument.createTextNode(code));
    const existingStyleNode = iframeDocument.head.querySelector(`#${id}`);
    if (existingStyleNode) {
      existingStyleNode.remove();
    }
    iframeDocument.head.appendChild(styleNode);
    setTimeout(() => {
      const firstMatch = allMatches[0];
      if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  }

  private evaluateXPathInIframe(
    xPath: string,
    context: HTMLElement | Document,
  ): HTMLElement[] {
    const iframeDocument = this.iframeRef.nativeElement.contentDocument;
    const xpathResult = iframeDocument.evaluate(xPath, context, null, 5);
    const nodes: HTMLElement[] = [];
    let node = xpathResult.iterateNext();
    while (node) {
      nodes.push(node as HTMLElement);
      node = xpathResult.iterateNext();
    }
    return nodes;
  }

  private use(fn: () => void) {
    this.reset();
    fn();
    this.hasChosen = true;
  }

  private reset() {
    this.refine = null;
  }

  useRefine() {
    this.use(() => {
      this.refine = true;
    });
  }

  edit() {
    this.reset();
    this.hasChosen = false;
  }
}
