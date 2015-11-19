import co from 'co';
import { exec } from '../utils';

const arrowURLs = [ '^https://github\\.com' ];

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status !== 'loading') return;
  const matched = tab.url.match(arrowURLs.join('|'));
  if (!matched) return;

  co(function *() {
    const result = yield exec.isInjected(tabId);
    if (chrome.runtime.lastError || result[0]) return;

    exec.loadScript('inject', tabId, () => {
      console.log('load inject bundle success!');
    });
  });
});
