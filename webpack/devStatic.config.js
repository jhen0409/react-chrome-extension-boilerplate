const path = require('path');

const devCommon = require('./devCommon');

module.exports = {
  ...devCommon,
  entry: {
    // content script & page script cannot use HMR due to CSP.
    // That's why devStatic is separated from devReloadable and
    // the best way to develop these two scripts is "webpack --watch" & full page reload.
    content: [path.join(__dirname, '../chrome/extension/content')],
    page: [path.join(__dirname, '../chrome/extension/page')]
  },
};
