import 'babel/polyfill';  // support generator
import bluebird from 'bluebird';

function promisifier(method) {
  // return a function
  return function promisified() {
    let args = [].slice.call(arguments);

    // which returns a promise
    return new Promise((resolve, reject) => {
      args.push(resolve);
      method.apply(this, args);
    });
  };
}

function promisifyAll(obj, list) {
  list.forEach( (api) => bluebird.promisifyAll(obj[api], { promisifier }) );
}

// let chrome extension api support Promise
promisifyAll(chrome, [
  'tabs',
  'windows',
  'browserAction',
  'contextMenus'
]);
promisifyAll(chrome.storage, [
  'local',
]);

require('./contextMenus');
require('./inject');
require('./badge');