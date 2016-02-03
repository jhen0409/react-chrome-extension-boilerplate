import React from 'react';
import ReactDOM from 'react-dom';
import Root from '../../app/todoapp/containers/Root';
import './todoapp.css';

chrome.storage.local.get('state', (obj) => {
  const { state } = obj;
  if (state) {
    window.state = JSON.parse(state);
  }

  const createStore = require('../../app/todoapp/store/configureStore');
  ReactDOM.render(
    <Root store={createStore()} />,
    document.querySelector('#root')
  );
});
