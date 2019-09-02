function getDocumentRoot() {
  return document.getElementsByTagName('body').item(0);
}

function findCandidatesFromRoot() {
  return findCandidates(getDocumentRoot(), []);
}

function scoreCandidateGroups(candidateGroups) {
  return candidateGroups.map(candidates => {
    return {
      size: candidates
        .map(candidate => {
          return candidate.offsetWidth * candidate.offsetHeight
        })
        .reduce((sum, area) => {
          return sum + area
        }, 0) / candidates.length,
      candidates: candidates
    }
  });
}

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

function findBestTitle(firstCandidatesTextNodes, otherCandidateNodes) {
  const titleNodes = firstCandidatesTextNodes;

  return titleNodes
    .find(titleNode => {
      return otherCandidateNodes.every(candidateNode => candidateNode.querySelector(titleNode.path));
    });
}

function findBestDescription(firstCandidatesTextNodes, otherCandidateNodes) {
  const descriptionNodes = firstCandidatesTextNodes;

  return descriptionNodes
    .find(descriptionNode => {
      return otherCandidateNodes.every(candidateNode => candidateNode.querySelector(descriptionNode.path));
    });
}

function findArticles() {
  const candidateGroups = findCandidatesFromRoot();
  console.log(`Found ${candidateGroups.length} groups of candidates`, candidateGroups);

  const scoredCandidateGroups = scoreCandidateGroups(candidateGroups)
    .filter(group => group.size > 0)
    .sort(group => group.size);

  console.log(`Filtered ${candidateGroups.length - scoredCandidateGroups.length} hidden groups, remaining ${scoredCandidateGroups.length}`, scoredCandidateGroups);

  if (scoredCandidateGroups.length === 0) {
    console.warn(`found ${scoredCandidateGroups.length} candidates, aborting`);
    return;
  }
  if (scoredCandidateGroups.length > 1) {
    console.warn(`found ${scoredCandidateGroups.length} candidates, taking largest`)
  }

  return scoredCandidateGroups
    .map(candidateGroup => {

      const firstCandidateNode = candidateGroup.candidates[0];
      const pathToArticle = getRelativePath(firstCandidateNode, getDocumentRoot());

      console.log(`Testing candidate group with path ${pathToArticle}`);

      // test path in other candidates
      const otherCandidateNodes = candidateGroup.candidates.filter(candidateNode => candidateNode !== firstCandidateNode);

      // find link
      const bestLink = findBestLink(firstCandidateNode, otherCandidateNodes);

      console.log('Found link', bestLink);

      // find title
      const textNodes = addPath(findTextNodes(firstCandidateNode), firstCandidateNode);

      if (textNodes.length === 0) {
        throw new Error('No text nodes found');
      }

      const bestTitle = findBestTitle(textNodes, otherCandidateNodes);
      const bestDescription = findBestDescription(textNodes, otherCandidateNodes);

      return {
        article: pathToArticle,
        title: bestTitle.path,
        description: bestDescription.path,
        link: bestLink.path
      };
    });
}

function getRelativePath(node, context) {
  let path = node.tagName; // tagName for text nodes is undefined
  while (node.parentNode !== context) {
    node = node.parentNode;
    if (typeof (path) === 'undefined') {
      path = node.tagName;
    } else {
      path = `${node.tagName}>${path}`;
    }
  }
  return path;
}


function findHrefNodes(node) {
  if (node.tagName === 'A' && node.getAttribute('href')) {
    return node;
  }
  return [].slice.call(node.children)
    .map(childNode => findHrefNodes(childNode))
    .flat(1);
}

function looksLikeAnArticle(node) {
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
