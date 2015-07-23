// send data to background
chrome.runtime.sendMessage({ type: 'data', data: { a: 1 } });
chrome.runtime.sendMessage({ type: 'contextMenus' });