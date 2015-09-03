import React from 'react';
import 'todomvc-app-css/index.css';

chrome.storage.local.get('state', (obj) => {
  let state = obj.state;
  if (state) {
    window.state = JSON.parse(state);
  }

  let Root = require('../../../app/containers/Root');
  React.render(
    <Root />,
    document.querySelector('#root')
  );
});