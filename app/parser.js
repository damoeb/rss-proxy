function findCandidatesFromRoot () {
    return findCandidates(document.getElementsByTagName('body').item(0), []);
}

function scoreCandidateGroups(candidateGroups) {
    return candidateGroups.map(candidates => {
        return {
            score: candidates
                .map(candidate => {
                    return candidate.offsetWidth * candidate.offsetHeight
                })
                .reduce((sum, area) => {return sum + area}, 0) / candidates.length,
            candidates: candidates
        }
    });
}

function findArticles () {
    const candidateGroups = findCandidatesFromRoot();

    const scoredCandidateGroups = scoreCandidateGroups(candidateGroups)
        .filter(group => group.score > 0)
        .sort(group => group.score);

    if (scoredCandidateGroups.length > 1) {
        console.warn(`found ${scoredCandidateGroups.length} candidates, taking largest`)
    }

    if (scoredCandidateGroups.length === 0) {
        console.warn(`found ${scoredCandidateGroups.length} candidates, aborting`);
        return;
    }

    const candidateGroup = scoredCandidateGroups[0];
//    generate models

    const firstCandidateNode = candidateGroup.candidates[0];

// find link
    const linkNodes = findHrefNodes(firstCandidateNode)
        .map(node => {
            return {size: node.offsetHeight * node.offsetWidth, node};
        })
        .map((wrapper => wrapper.node));

    // test path in other candidates
    const otherCandidateNodes = candidateGroup.candidates.filter(candidateNode => candidateNode !== firstCandidateNode);

    // fink link that exists in every candidate
    const bestLink = linkNodes.map(linkNode => {
            return {
                node: linkNode,
                path: getRelativePath(linkNode, firstCandidateNode)
            }
        })
        .find(link => {
        return otherCandidateNodes.every(candidateNode => candidateNode.querySelector(link.path));
        });

    console.log('bestLink', bestLink);

    // find title
    // const textNodes = findTextNodes(firstCandidateNode);
    // console.log(textNodes);

    // find desc that is if possible not title


//    score models
    return candidateGroup;
}

function getRelativePath(node, context) {
    let path = node.tagName;
    while(node.parentNode !== context) {
        node = node.parentNode;
        path = `${node.tagName}>${path}`;
    }
    return path;
}


function findHrefNodes (node) {
    if (node.tagName === 'A' && node.getAttribute('href')) {
        return node;
    }
    return [].slice.call(node.children)
        .map(childNode => findHrefNodes(childNode))
        .flat(1);
}

function extractHrefs (node, maxDepth) {
    if (maxDepth === 0) {
        return [];
    }
    if (node.tagName === 'A') {
        return node.getAttribute('href');
    }
    return [].slice.call(node.children)
        .map(childNode => extractHrefs(childNode, maxDepth -1))
        .flat(1)
        .reduce((uniqList, currentValue) => {
        if (uniqList.indexOf(currentValue) === -1) {
            uniqList.push(currentValue);
        }
        return uniqList;
    }, []);
}

function looksLikeAnArticle (node) {
    const hasLinks = extractHrefs(node, 5).length;
    const hasTitle = findTextNodes(node).length > 0;
    return hasLinks && hasTitle;
}

function findTextNodes (node) {

    const textNodes = [];

    if (node.cloneNode().textContent.trim().split(' ').length > 3) {
        textNodes.push(node);
    }

    const childTextNodes = [].slice.call(node.childNodes)
        .map(childNode => findTextNodes(childNode))
        .flat(1);

    childTextNodes.push(...textNodes);

    return childTextNodes;

}

function findCandidates (node, ignoredNodes) {
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


function scoreModels() {

    // hard
    minTextNodeCount = 1
    minLinkNodeCount = 1

    // soft
    titleLen = 10;
    bodyLen = 100;
    linksCount = 1;


}
