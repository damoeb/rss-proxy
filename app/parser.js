module.exports = function (document, console) {

  function avgWordCount(nodes) {
    return nodes.map(node => node.textContent.trim().split(' ').length).reduce((totalWordCount, wordCount) => {
      return totalWordCount + wordCount
    }, 0) / nodes.length;
  }

  function selectAll(contextNode, query) {
    return Array.from(contextNode.querySelectorAll(query));
  }

  function getDocumentRoot() {
    return document.getElementsByTagName('body').item(0);
  }

  function findCandidatesFromRoot() {
    return findCandidates(getDocumentRoot(), []);
  }

  this.findArticles = () => {
    const rules = this.findArticleRules();

    const bestRule = rules[0].rules;

    return Array.from(document.querySelectorAll(bestRule.article)).map((articleNode) => {
      return {
        title: selectAll(articleNode, bestRule.title)[0].textContent,
        // todo absolute link
        link: selectAll(articleNode, bestRule.link)[0].getAttribute('href'),
        description: selectAll(articleNode, bestRule.description)[0].textContent
      }
    });
  };

  function addPath(nodes, context) {
    return nodes.map(node => {
      return {
        node: node,
        path: getRelativePath(node, context)
      }
    });
  }

  function findBestLink(firstCandidateNode, otherCandidateNodes) {
    const linkNodes = addPath(findHrefNodes(firstCandidateNode), firstCandidateNode);

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

  function findBestDescription(textNodes, otherCandidateNodes) {
    // todo description can be a markup node,
    const descriptionNodes = textNodes.length > 1 ? textNodes.filter((val, index) => index !== 0).concat([textNodes[0]]) : textNodes;
    return descriptionNodes
      .find(descriptionNode => {
        if (descriptionNode.path) {
          console.log(`Testing description-node ${descriptionNode.path}`);
          return otherCandidateNodes.every(candidateNode => candidateNode.querySelector(descriptionNode.path));
        } else {
          console.log('description-node is candiate');
          return true;
        }
      });
  }

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
          newUnifiedPath.push('')
        }
      }

      return newUnifiedPath;

    }, []).join(' ');
  };

  this.mergeRules = (list) => {
    // todo merge article paths, by removing classNames if feature-paths match
    return list.map(articleRule => {
      const {rules} = articleRule;
      articleRule.id = [rules.articleTagName, rules.title, rules.description, rules.link].join('/');
      return articleRule;
    }).reduce((mergedList, articleRule) => {

      const mergedRule = mergedList.find(mergedRule => mergedRule.id === articleRule.id);
      if (mergedRule) {
        const {rules, stats} = mergedRule;
        // todo fix rules
        rules.article = this.mergePaths([rules.article, articleRule.rules.article]);
        stats.articleCount = stats.articleCount + articleRule.stats.articleCount;
      } else {
        delete articleRule.id;
        mergedList.push(articleRule);
      }

      return mergedList;
    }, []);
  };

  function getScore(stats) {
    // todo implement
    return stats.articleCount;
  }

  this.findArticleRules = () => {
    const candidateGroups = findCandidatesFromRoot();
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

          const firstCandidateNode = candidates[0];
          const pathToArticle = getRelativePath(firstCandidateNode, getDocumentRoot());

          console.log(`Testing candidate group with path ${pathToArticle}`);

          // test path in other candidates
          const otherCandidateNodes = candidates.filter(candidateNode => candidateNode !== firstCandidateNode);

          // find link
          const bestLink = findBestLink(firstCandidateNode, otherCandidateNodes);
          if (!bestLink) {
            // throw new Error('No text nodes found');
            return undefined;
          }

          console.log('Found link', bestLink.node.getAttribute('href'));

          // find title
          const textNodes = addPath(findTextNodes(firstCandidateNode), firstCandidateNode);

          if (textNodes.length === 0) {
            // throw new Error('No text nodes found');
            return undefined;
          }

          const bestTitle = findBestTitle(textNodes, otherCandidateNodes);
          const bestDescription = findBestDescription(textNodes, otherCandidateNodes);

          if (!bestTitle) {
            // throw new Error('No title node found');
            return undefined;
          }

          return {
            rules: {
              article: pathToArticle,
              articleTagName: firstCandidateNode.tagName,
              title: bestTitle.path,
              description: bestDescription.path,
              link: bestLink.path
            },
            stats: {
              articleCount: candidates.length
            }
          };
        })
        .filter(candidateGroup => candidateGroup))
      .map(candidateGroup => {
        const stats = {
          articleCount: candidateGroup.stats.articleCount,
          avgTitleWordCount: avgWordCount(selectAll(getDocumentRoot(), candidateGroup.rules.article + '>' + candidateGroup.rules.title)),
          avgDescriptionWordCount: avgWordCount(selectAll(getDocumentRoot(), candidateGroup.rules.article + '>' + candidateGroup.rules.description)),
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

  function getRelativePath(node, context) {
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
    return [].slice.call(node.children)
      .map(childNode => findHrefNodes(childNode)).flat(1);
  }

  function looksLikeAnArticle(node) {
    if (node === getDocumentRoot()) {
      return false;
    }
    const hasLinks = findHrefNodes(node).length > 0;
    const hasTexts = findTextNodes(node).length > 0;
    return hasLinks && hasTexts;
  }

  function findTextNodes(node) {

    const minTitleWordCount = 3;
    const textNodes = [];

    if (['SCRIPT', 'STYLE'].indexOf(node.tagName) === -1 && node.nodeName !== '#comment' && node.cloneNode().textContent.trim().split(' ').length > minTitleWordCount) {
      textNodes.push(node);
    }

    const childTextNodes = [].slice.call(node.childNodes)
      .map(childNode => findTextNodes(childNode))
      .flat(1);

    childTextNodes.push(...textNodes);

    return childTextNodes;

  }

  function findCandidates(node, ignoredNodes) {
    // self
    const canditateGroup = [];
    if (looksLikeAnArticle(node) && ignoredNodes.indexOf(node) === -1) {

      const neighbors = [].slice.call(node.parentNode.children).filter(sibling => sibling !== node);

      const similarNeighbors = neighbors.filter(neighbor => neighbor.tagName === node.tagName
        && neighbor.attributes.length === node.attributes.length);

      const articleNeighbors = similarNeighbors.filter(neighbor => looksLikeAnArticle(neighbor));

      if (articleNeighbors.length > 2) {
        canditateGroup.push([node, ...articleNeighbors]);
        ignoredNodes.push(node);
        ignoredNodes.push(...articleNeighbors);
      }
    }

    // children
    const childCanditateGroup = [].slice.call(node.children)
      .map(childNode => findCandidates(childNode, ignoredNodes))
      .flat(1);

    childCanditateGroup.push(...canditateGroup);
    return childCanditateGroup;
  }

  return this;
};
