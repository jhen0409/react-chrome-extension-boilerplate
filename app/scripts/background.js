let data;
let window_id;
const CONTEXT_MENU_ID = 'example_context_menu';

chrome.storage.local.get('todos', (obj) => {
  let todos = obj.todos;
  if (todos) {
    todos = JSON.parse(todos);
    let len = todos.filter((todo) => !todo.marked).length;
    if (len > 0) {
      chrome.browserAction.setBadgeText({ text: len.toString() });
    }
  } else {
    // Initial
    chrome.browserAction.setBadgeText({ text: '1' });
  }
});

function closeIfExist() {
  if (window_id > 0) {
    chrome.windows.remove(window_id);
    window_id = chrome.windows.WINDOW_ID_NONE;
  }
}

function popWindow(type) {
  closeIfExist();
  let options = {
    type: 'popup',
    left: 100, top: 100,
    width: 800, height: 475
  };
  if (type == 'open') {
    options.url = 'app.html?q=' + JSON.stringify(data);
    chrome.windows.create(options, (win) => {
      window_id = win.id;
    });
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'data':
      data = request.data;
      break;
    case 'contextMenus':
      chrome.contextMenus.create({
        id: CONTEXT_MENU_ID,
        title: 'React Chrome Extension Example',
        contexts: ['all'],
        documentUrlPatterns: [
          '*://github.com/*'
        ]
      });
      break;
    case 'open':
      popWindow('open');
      break;
  }
});

chrome.contextMenus.onClicked.addListener((event) => {
  if (event.menuItemId == CONTEXT_MENU_ID) {
    popWindow('open');
  }
});