import React from 'react';
import 'todomvc-app-css/index.css';

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