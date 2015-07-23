import React from 'react';
import 'todomvc-app-css/index.css';

// location.search
let searchObj = getObjectsBySearch(unescape(location.search));

function getObjectsBySearch(searchStr) {
  searchStr = searchStr.replace('?', '');
  let keyValues = searchStr.split('&');
  return keyValues.map(keyValue => {
    keyValue = keyValue.split('=');
    return {
      key: keyValue[0],
      value: keyValue[1]
    };
  });
}

chrome.storage.local.get('todos', (obj) => {
  let todos = obj.todos;
	if (todos) {
    window.todos = JSON.parse(todos);
  }

  let App = require('../containers/App');
  React.render(
    <App />,
    document.querySelector('#root')
  );
});