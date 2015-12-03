
export function isInjected(tabId) {
  return chrome.tabs.executeScriptAsync(tabId, {
    code: 'var injected = window.reactExampleInjected; window.reactExampleInjected = true; injected;',
    runAt: 'document_start'
  });
}

export function loadScript(name, tabId, cb) {
  if (process.env.NODE_ENV === 'production') {
    chrome.tabs.executeScript(tabId, { file: `/js/${name}.bundle.js`, runAt: 'document_start' }, () => cb());
  } else {
    // dev: async fetch bundle
    fetch(`https://localhost:3000/js/${name}.bundle.js`).then(response => {
      return response.text();
    }).then(response => {
      chrome.tabs.executeScript(tabId, { code: response, runAt: 'document_start' }, () => cb());
    });
  }
}