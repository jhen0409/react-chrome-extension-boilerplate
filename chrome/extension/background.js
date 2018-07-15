import { isContentScriptLoaded, loadContentScript } from './background/contentScriptLoader';

require('./background/contextMenus');
require('./background/badge');


const targetURL = '^https://github\\.com';

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'loading' || !tab.url.match(targetURL)) {
    return;
  }

  const result = await isContentScriptLoaded(tabId);
  if (chrome.runtime.lastError || result[0]) {
    return;
  }

  // content script can be loaded from background script dynamically.
  // (or it can be loaded directly from manifest.json file.)
  loadContentScript(tabId, () => {
    console.log('load content bundle from background success!');
  });
});
