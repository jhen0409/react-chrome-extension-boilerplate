import React from 'react';
import 'todomvc-app-css/index.css';

chrome.storage.local.get('state', (obj) => {
  let state = obj.state;
  if (state) {
    window.state = JSON.parse(state);
  }

  let App = require('../containers/App');
  React.render(
    <App />,
    document.querySelector('#root')
  );
});