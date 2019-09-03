module.exports = function (document, console) {

  function avgWordCount(nodes) {
    return nodes.map(node => node.textContent.trim().split(' ').length).reduce((totalWordCount, wordCount) => {
      return totalWordCount + wordCount
    }, 0) / nodes.length;
  }

  function selectAll(contextNode, query) {
    return [].slice.call(contextNode.querySelectorAll(query));
  }

  function getDocumentRoot() {
    return document.getElementsByTagName('body').item(0);
  }

  function findCandidatesFromRoot() {
    return findCandidates(getDocumentRoot(), []);
  }

  // function scoreCandidateGroups(candidateGroups) {
  //   return candidateGroups.map(candidates => {
  //     return {
  //       size: candidates
  //         .map(candidate => {
  //           return candidate.offsetWidth * candidate.offsetHeight
  //         })
  //         .reduce((sum, area) => {
  //           return sum + area
  //         }, 0) / candidates.length,
  //       candidates: candidates
  //     }
  //   });
  // }

  function addPath(nodes, context) {
    return nodes.map(linkNode => {
      return {
        node: linkNode,
        path: getRelativePath(linkNode, context)
      }
    });
  }

  function findBestLink(firstCandidateNode, otherCandidateNodes) {
    const linkNodes = addPath(findHrefNodes(firstCandidateNode), firstCandidateNode);

    // fink link that exists in every candidate
    return linkNodes
      .find(linkNode => {
        return otherCandidateNodes.every(candidateNode => candidateNode.querySelector(linkNode.path));
      });
  }

  function findBestTitle(textNodes, otherCandidateNodes) {
    const titleNodes = textNodes;

    return titleNodes
      .find(titleNode => {
        return otherCandidateNodes.every(candidateNode => candidateNode.querySelector(titleNode.path));
      });
  }

  function findBestDescription(textNodes, otherCandidateNodes) {
    const descriptionNodes = textNodes.length > 1 ? textNodes.filter((val, index) => index !== 0) : textNodes;
    return descriptionNodes
      .find(descriptionNode => {
        return otherCandidateNodes.every(candidateNode => candidateNode.querySelector(descriptionNode.path));
      });
  }

  function mergeRules(list) {
    // todo merge article paths, by removing classNames if feature-paths match
    return list;
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

    return mergeRules(
      candidateGroups
        .map(candidates => {

          const firstCandidateNode = candidates[0];
          const pathToArticle = getRelativePath(firstCandidateNode, getDocumentRoot());

          console.log(`Testing candidate group with path ${pathToArticle}`);

          // test path in other candidates
          const otherCandidateNodes = candidates.filter(candidateNode => candidateNode !== firstCandidateNode);

          // find link
          const bestLink = findBestLink(firstCandidateNode, otherCandidateNodes);

          console.log('Found link', bestLink.node.getAttribute('href'));

          // find title
          const textNodes = addPath(findTextNodes(firstCandidateNode), firstCandidateNode);

          if (textNodes.length === 0) {
            throw new Error('No text nodes found');
          }

          const bestTitle = findBestTitle(textNodes, otherCandidateNodes);
          const bestDescription = findBestDescription(textNodes, otherCandidateNodes);

          return {
            rules: {
              article: pathToArticle,
              title: bestTitle.path,
              description: bestDescription.path,
              link: bestLink.path
            },
            stats: {
              articleCount: candidates.length
            }
          };
        }))
      .map(candidateGroup => {
        return {
          rules: candidateGroup.rules,
          stats: {
            articleCount: candidateGroup.stats.articleCount,
            avgTitleWordCount: avgWordCount(selectAll(getDocumentRoot(), candidateGroup.rules.article + '>' + candidateGroup.rules.title)),
            avgDescriptionWordCount: avgWordCount(selectAll(getDocumentRoot(), candidateGroup.rules.article + '>' + candidateGroup.rules.description)),
            titleDiffersDescription: candidateGroup.rules.title !== candidateGroup.rules.description
          }
        }
      });
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

    if (node.cloneNode().textContent.trim().split(' ').length > minTitleWordCount) {
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
