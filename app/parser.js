module.exports = function (document, console) {

  function toWords(text) {
    return text.trim().split(' ').filter(word => word.length > 0);
  }

  function avgWordCount(nodes) {
    return nodes.map(node => toWords(node.textContent.trim()).length).reduce((totalWordCount, wordCount) => {
      return totalWordCount + wordCount
    }, 0) / nodes.length;
  }

  function selectAll(contextNode, selector) {
    const matches = Array.from(contextNode.querySelectorAll(selector));
    // if (matches.length === 0) {
    //   throw new Error(`Cannot find selector ${selector} in html ${contextNode.outerHTML}`);
    // }

    return matches;
  }

  function getDocumentRoot() {
    return document.getElementsByTagName('body').item(0);
  }

  this.findCandidatesFromRoot = () => {
    return this.findCandidates(getDocumentRoot(), []);
  };

  this.findArticles = () => {
    const rules = this.findArticleRules();

    const bestRule = rules[0].rules;

    return Array.from(document.querySelectorAll(bestRule.article))
      .map((articleNode) => {
        try {
          const title = selectAll(articleNode, bestRule.title)[0].textContent.trim();
          // todo find text then find common parent that is not article
          const descriptions = bestRule.description ? selectAll(articleNode, bestRule.description)[0].textContent.trim() : articleNode.textContent.trim().replace(title, '');

          return {
            title,
            // todo absolute link
            link: selectAll(articleNode, bestRule.link)[0].getAttribute('href'),
            description: descriptions.trim()
          }
        } catch (e) {
          // ignore, cause some selectors may return empty-results cause the article-selector is not specific enough
          return undefined
        }
      })
      .filter(article => article);
  };

  this.addPath = (nodes, context) => {
    return nodes.map(node => {
      return {
        node: node,
        path: this.getRelativePath(node, context)
      }
    });
  };

  this.findBestLink = (firstCandidateNode, otherCandidateNodes) => {
    const linkNodes = this.addPath(findHrefNodes(firstCandidateNode), firstCandidateNode);

    // fink link that exists in every candidate
    return linkNodes
      .filter(linkNode => linkNode.node.textContent.trim().length > 0)
      .find(linkNode => {
        return otherCandidateNodes.every(candidateNode => candidateNode.querySelector(linkNode.path));
      });
  }

  function findBestTitle(textNodes, otherCandidateNodes) {
    const titleNodes = textNodes;

    return titleNodes
      .find(titleNode => {
        console.log(`Testing title-node ${titleNode.path}`);
        if (titleNode.path) {
          return otherCandidateNodes.every(candidateNode => candidateNode.querySelector(titleNode.path));
        } else {
          console.log('title-node is candiate');
          return true;
        }
      });
  }

  // function findBestDescription(textNodes, titleNode, otherCandidateNodes) {
  //   // todo try to find explicit node d, if d == candidate or is null take the entire textContent of candidate and remove the title string
  //   const descriptionNodes = textNodes.filter((textNode) => !textNode.node.isSameNode(titleNode.node));
  //   return descriptionNodes
  //     .filter(descriptionNode => {
  //       if (descriptionNode.path) {
  //         console.log(`Testing description-node ${descriptionNode.path}`);
  //         return otherCandidateNodes.every(candidateNode => candidateNode.querySelector(descriptionNode.path));
  //       } else {
  //         console.log('description-node is candiate');
  //         return true;
  //       }
  //     });
  // }

  this.mergePaths = (paths) => {
    return paths.map(path => path.split('>')).reduce((unifiedPath, path) => {
      if (unifiedPath.length === 0) {
        return path;
      }

      const newUnifiedPath = [];
      for(let i=0; i<Math.min(unifiedPath.length, path.length); i++) {
        if (unifiedPath[i] === path[i]) {
          newUnifiedPath.push(path[i]);
        } else {
          const tagName = path[i].replace(/\..*$/,'');
          if (unifiedPath[i].replace(/\..*$/,'') === tagName) {
            newUnifiedPath.push(tagName);
          } else {
            newUnifiedPath.push('*');
          }
        }
      }

      return newUnifiedPath;

    }, []).join('>');
  };

  this.mergeRules = (list) => {
    const groupedByRuleId = list

      // add ruleId
      .map(articleRule => {
        const {rules} = articleRule;
        articleRule.ruleId = [rules.articleTagName, rules.title, rules.description, rules.link].join('/');
        return articleRule;
      })
      // group by
      .reduce((id2rules, currentRule) => {

        if (!id2rules[currentRule.ruleId]) {
          id2rules[currentRule.ruleId] = [];
        }

        id2rules[currentRule.ruleId].push(currentRule);

        return id2rules;
      }, {});

    return Object.values(groupedByRuleId).map(rules => {
      const path = this.mergePaths(rules.map(rule => rule.rules.article));

      const mergedRule = rules[0];
      mergedRule.rules.article = path;
      mergedRule.stats.articleCount = rules.map(rule => rule.stats.articleCount).reduce((sum, count) => {
        sum += count;
        return sum;
      }, 0);

      return mergedRule;
    });
  };

  function getScore(stats) {
    // article count
    const scoreArticleCount = Math.log(stats.articleCount) / 10;
    // desc word count
    const scoreDescriptionWordCount = stats.avgDescriptionWordCount > 3 ? 0.3 : 0;
    // title word count
    const scoreTitleWordCount = stats.avgTitleWordCount > 3 ? 0.3 : 0;
    // title differs
    const scoreTittleDiffers = stats.titleDiffersDescription ? 0.3: 0;

    return scoreArticleCount + scoreTitleWordCount + scoreDescriptionWordCount + scoreTittleDiffers;
  }

  this.findArticleRules = () => {
    const candidateGroups = this.findCandidatesFromRoot();
    console.log(`Found ${candidateGroups.length} groups of candidates`, candidateGroups);

    if (candidateGroups.length === 0) {
      console.warn(`found ${candidateGroups.length} candidates, aborting`);
      return;
    }
    if (candidateGroups.length > 1) {
      console.warn(`found ${candidateGroups.length} candidates, taking largest`)
    }

    return this.mergeRules(
      candidateGroups
        .map(candidates => {
          try {
            const firstCandidateNode = candidates[0];
            const pathToArticle = this.getRelativePath(firstCandidateNode, getDocumentRoot());

            console.log(`Testing candidate group with path ${pathToArticle}`);

            // test path in other candidates
            const otherCandidateNodes = candidates.filter(candidateNode => candidateNode !== firstCandidateNode);

            // find link
            const bestLink = this.findBestLink(firstCandidateNode, otherCandidateNodes);
            if (!bestLink) {
              // throw new Error('No text nodes found');
              return undefined;
            }

            console.log('Found link', bestLink.node.getAttribute('href'));

            // find title
            const textNodes = this.findTextNodes(firstCandidateNode, 5);
            // const textNodes = this.addPath(nodes, firstCandidateNode);
            //
            // if (textNodes.length === 0) {
            //   throw new Error(`No text nodes found in ${firstCandidateNode.node}`);
            // }

            const bestTitle = findBestTitle(this.addPath(textNodes, firstCandidateNode), otherCandidateNodes);
            const bestDescriptionPath = this.findCommonParentPath(textNodes.filter(node => !node.isSameNode(bestTitle.node)), firstCandidateNode);

            if (!bestTitle) {
              throw new Error('No title node found');
            }

            return {
              rules: {
                article: pathToArticle,
                articleTagName: firstCandidateNode.tagName,
                title: bestTitle.path,
                description: bestDescriptionPath,
                link: bestLink.path
              },
              stats: {
                articleCount: candidates.length
              }
            };
          } catch (e) {
            console.warn(e);
            return undefined;
          }
        })
        .filter(candidateGroup => candidateGroup))
      .map(candidateGroup => {
        const stats = {
          articleCount: candidateGroup.stats.articleCount,
          avgTitleWordCount: avgWordCount(selectAll(getDocumentRoot(), candidateGroup.rules.article + '>' + candidateGroup.rules.title)),
          avgDescriptionWordCount: candidateGroup.rules.description ? avgWordCount(selectAll(getDocumentRoot(), candidateGroup.rules.article + '>' + candidateGroup.rules.description)) : 0,
          titleDiffersDescription: candidateGroup.rules.title !== candidateGroup.rules.description
        };
        return {
          rules: candidateGroup.rules,
          stats,
          score: getScore(stats)
        }
      })
      .sort((a, b) => {return b.score - a.score});
  };

  function getTagName(node) {
    const classList = Array.from(node.classList)
      .filter(cn => cn.match('[0-9]+') === null);
    if (classList.length > 0) {
      return `${node.tagName}.${classList.join('.')}`;
    }
    return node.tagName;
  }

  this.findCommonParentPath = (nodes, root) => {
    if (nodes.length === 0) {
      return;
    }
    if (nodes.length === 1) {
      return this.getRelativePath(nodes[0], root);
    }
    const paths = nodes.map(node => this.getRelativePath(node, root)).map(path => path.split('>'));

    const firstPath = paths[0];

    let pos = 0;
    while (paths.every(path => path[pos] === firstPath[pos]) && firstPath.length > pos) {
      pos++;
    }

    return firstPath.filter((el,index) => index < pos).join('>');

  };

  this.getRelativePath = (node, context) => {
    console.log(`getting path of ${node} in ${context}`);
    let path = node.tagName; // tagName for text nodes is undefined
    while (node.parentNode !== context) {
      node = node.parentNode;
      if (typeof (path) === 'undefined') {
        path = getTagName(node);
      } else {
        path = `${getTagName(node)}>${path}`;
      }
    }
    return path;
  }

  function findHrefNodes(node) {
    if (node.tagName === 'A' && node.getAttribute('href')) {
      return node;
    }
    return Array.from(node.children)
      .map(childNode => findHrefNodes(childNode))
      .flat(1);
  }

  this.looksLikeAnArticle = (node) => {
    if (node === getDocumentRoot()) {
      return false;
    }
    // todo abort if found one\
    // todo an href usually contains a textnode too
    return findHrefNodes(node).length > 0 && this.findTextNodes(node, 3).length > 0;
  }

  this.findTextNodes = (node, minTitleWordCount=1) => {

    const textNodes = [];

    if (['SCRIPT', 'STYLE'].indexOf(node.tagName) === -1
      && node.nodeName !== '#comment'
      && toWords(node.cloneNode().textContent).length >= minTitleWordCount) {
      textNodes.push(node);
    }

    const childTextNodes = Array.from(node.childNodes)
      .map(childNode => this.findTextNodes(childNode, minTitleWordCount))
      .flat(1);

    textNodes.push(...childTextNodes);

    return textNodes;
  }

  this.findCandidates = (node, ignoredNodes) => {
    // self
    const canditateGroup = [];
    if (ignoredNodes.indexOf(node) === -1 && this.looksLikeAnArticle(node)) {

      const neighbors = Array.from(node.parentNode.children).filter(sibling => sibling !== node);

      const similarNeighbors = neighbors.filter(neighbor => neighbor.tagName === node.tagName
        && neighbor.attributes.length === node.attributes.length);

      const articleNeighbors = similarNeighbors.filter(neighbor => this.looksLikeAnArticle(neighbor));

      if (articleNeighbors.length > 2) {
        canditateGroup.push([node, ...articleNeighbors]);
        ignoredNodes.push(node);
        ignoredNodes.push(...articleNeighbors);
      }
    }

    // children
    const childCanditateGroup = Array.from(node.children)
      .map(childNode => this.findCandidates(childNode, ignoredNodes))
      .flat(1);

    childCanditateGroup.push(...canditateGroup);
    return childCanditateGroup;
  }

  return this;
};
