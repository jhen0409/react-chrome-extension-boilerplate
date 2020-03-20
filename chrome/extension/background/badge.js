chrome.storage.local.get('state', (obj) => {
  const state = JSON.parse(obj.state);
  const todos = state.todos;
  if (todos) {
    const len = todos.filter(todo => !todo.marked).length;
    if (len > 0) {
      chrome.browserAction.setBadgeText({ text: len.toString() });
    }
  } else {
    // Initial
    chrome.browserAction.setBadgeText({ text: '1' });
  }
});
