import React from 'react';
import 'todomvc-app-css/index.css';

function getObjectsBySearch(searchStr) {
  let keyValues = searchStr.replace('?', '').split('&');
  return keyValues.map(keyValue => {
    let result = keyValue.split('=');
    return {
      key: result[0],
      value: result[1]
    };
  });
}

// location.search
let searchObj = getObjectsBySearch(unescape(location.search));

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