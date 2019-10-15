const fs = require('fs');
const {JSDOM} = require('jsdom');

if (!Array.prototype.flat) {
  Object.defineProperty(Array.prototype, 'flat', {
    value: function (depth = 1) {
      return this.reduce(function (flat, toFlatten) {
        return flat.concat((Array.isArray(toFlatten) && (depth > 1)) ? toFlatten.flat(depth - 1) : toFlatten);
      }, []);
    }
  });
}

module.exports = new function() {
  this.getDocumetOfHtmlFile = (path) => {
    const contents =  fs.readFileSync(path, 'utf8');
    const window = new JSDOM(contents).window;
    return window.document;
  }

  this.getMockConsole = (loud) => {
    if (loud) {
      return console;
    }
    return new function() {
      this.log = () => {};
      this.warn = () => {};
      this.error = () => {};
    };
  };
};
