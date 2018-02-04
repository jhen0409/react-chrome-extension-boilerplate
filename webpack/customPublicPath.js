/* eslint-disable no-global-assign */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* global __webpack_public_path__ __HOST__ __PORT__ */

if (process.env.NODE_ENV === 'production') {
  __webpack_public_path__ = chrome.extension.getURL('/js/');
} else {
  // In development mode,
  // the iframe of injectpage cannot get correct path,
  // it need to get parent page protocol.
  const path = `//${__HOST__}:${__PORT__}/js/`;
  if (
    window.location.protocol === 'https:' ||
    window.location.search.indexOf('protocol=https') !== -1
  ) {
    __webpack_public_path__ = `https:${path}`;
  } else {
    __webpack_public_path__ = `http:${path}`;
  }
}
