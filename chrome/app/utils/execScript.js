
export function isInjected(tabId) {
  return chrome.tabs.executeScriptAsync(tabId, {
    code: 'var injected = window.reactExampleInjected; window.reactExampleInjected = true; injected;',
    runAt: 'document_start'
  });
}

export function loadScript(name, tabId, cb) {
  if (process.env.NODE_ENV === 'production') {
    chrome.tabs.executeScript(tabId, { file: `/js/${name}.bundle.js`, runAt: 'document_start' }, cb);
  } else {
    // dev: async fetch bundle
    fetch(`https://localhost:3000/js/${name}.bundle.js`).then(response => {
      return response.text();
    }).then(fetchRes => {
      if (process.env.DEVTOOLS_EXT) {
        const request = new XMLHttpRequest();
        request.open('GET', 'chrome-extension://lmhkpmbekcpmknklioeibfkpmmfibljd/js/inject.bundle.js');
        request.send();
        request.onload = function() {
          if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            chrome.tabs.executeScript(tabId, { code: request.responseText, runAt: 'document_start' });
          }
        };
      }
      chrome.tabs.executeScript(tabId, { code: fetchRes, runAt: 'document_start' }, cb);
    });
  }
}