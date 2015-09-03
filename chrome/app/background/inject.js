
const arrowURLs = [ 'https://github.com' ];

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status !== 'loading') return;
  const matched = arrowURLs.every(url => !!tab.url.match(url));
  if (!matched) return;

  chrome.tabs.executeScript(tabId, {
    code: 'var injected = window.reactExampleInjected; window.reactExampleInjected = true; injected;',
    runAt: 'document_start'
  }, (result) => {
    if (chrome.runtime.lastError || result[0]) return;

    if (__DEVELOPMENT__) {
      // dev: async fetch bundle
      fetch('https://localhost:3000/js/inject.bundle.js').then(response => {
        return response.text();
      }).then(response => {
        chrome.tabs.executeScript(tabId, { code: response, runAt: 'document_start' });
      });
    } else {
      // prod
      chrome.tabs.executeScript(tabId, { file: '/js/inject.bundle.js', runAt: 'document_start' });
    }
  });
});