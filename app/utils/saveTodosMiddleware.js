function saveTodos(state) {
  chrome.storage.local.set({ todos: JSON.stringify(state) });
  let count = state.filter((todo) => !todo.marked).length;
  chrome.browserAction.setBadgeText({ text: count > 0 ? count.toString() : '' });
}

export default function saveTodosMiddleware({ dispatch, getState }) {
  return next => action => {
    next(action);
    if (action.lastSaveTodos) {
      saveTodos(getState().todos);
    }
  };
}