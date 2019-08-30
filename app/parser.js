// function parseArticles (node) {
//     const childNodes = [].slice.call(node.childNodes);
//
//     // if (childNodes.length > 0) {
//     //
//     // }
//     return childNodes.map(childNode => childNode.textContent.trim()).filter(text => text.length > 10);
//     // const silblingsNodes = this.toArray(node.childNodes)
// }
//
// function findLinks (node) {
//
//     if (node.nodeName.toUpperCase() === 'A') {
//         return node.getAttribute('href');
//     }
//
//     const childNodes = [].slice.call(node.childNodes);
//
//     if (childNodes.length === 0) {
//         return [];
//     }
//     // is a a element
//     // or dig deeper
//
//     return childNodes.map(childNode => findLinks(childNode)).filter(link => link.length).reduce((previousValue, currentValue, accumulator) => {
//
//     });
//     // const silblingsNodes = this.toArray(node.childNodes)
// }

function findCandidatesFromRoot () {
    const candidates = [];
    findCandidates(document.getElementsByTagName('body').item(0), candidates, []);
    console.log(candidates);
}

function hasFeaturesOfArticle (node) {

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

function findCandidates (node, candidateGroups, ignoredNodes) {
    // self

    if (looksLikeAnArticle(node) && ignoredNodes.indexOf(node) === -1) {

        const neighbors = [].slice.call(node.parentNode.children).filter(sibling => sibling !== node);

        const similarNeighbors = neighbors.filter(neighbor => neighbor.tagName === node.tagName
            && neighbor.attributes.length === node.attributes.length);

        const articleNeighbors = similarNeighbors.filter(neighbor => looksLikeAnArticle(neighbor));

        if (articleNeighbors.length > 2) {
            console.log('candidate', node);
            candidateGroups.push([node, ...articleNeighbors]);
            ignoredNodes.push(node);
            ignoredNodes.push(...articleNeighbors);
        }
    }

    // children
    [].slice.call(node.children).map(childNode => findCandidates(childNode, candidateGroups, ignoredNodes));
}

function findSameSiblings() {

}

function findTexts() {

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
