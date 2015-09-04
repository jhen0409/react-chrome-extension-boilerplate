function saveState(state) {
  chrome.storage.local.set({ state: JSON.stringify(state) });
}

// todos unmarked count
function setBadge(todos) {
  if (chrome.browserAction) {
    let count = todos.filter((todo) => !todo.marked).length;
    chrome.browserAction.setBadgeText({ text: count > 0 ? count.toString() : '' });
  }
}

export default function() {
  return next => (reducer, initialState) => {
    let store = next(reducer, initialState);
    store.subscribe(function() {
      let state = store.getState();
      saveState(state);
      setBadge(state.todos);
    });
    return store;
  };
}