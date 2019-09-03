const fs = require('fs');
const {JSDOM} = require('jsdom');

module.exports = new function() {
  this.getDocumetOfHtmlFile = (path) => {
    const contents =  fs.readFileSync(path, 'utf8');
    const window = new JSDOM(contents).window;
    return window.document;
  }
}
