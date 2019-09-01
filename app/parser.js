function findCandidatesFromRoot () {
    return findCandidates(document.getElementsByTagName('body').item(0), []);
}

function scoreCandidateGroups(candidateGroups) {
    return candidateGroups.map(candidates => {
        return {
            size: candidates
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
        .filter(group => group.size > 0)
        .sort(group => group.size);

    if (scoredCandidateGroups.length > 1) {
        console.warn(`found ${scoredCandidateGroups.length} candidates, taking largest`)
    }

    if (scoredCandidateGroups.length === 0) {
        console.warn(`found ${scoredCandidateGroups.length} candidates, aborting`);
        return;
    }

    const candidate = scoredCandidateGroups[0];
//    generate models
//    score models
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
