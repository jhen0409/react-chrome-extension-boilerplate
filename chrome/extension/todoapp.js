import React from 'react';
import ReactDOM from 'react-dom';
import Root from '../../app/todoapp/containers/Root';
import './todoapp.css';

chrome.storage.local.get('state', obj => {
  const { state } = obj;
  const initialState = JSON.parse(state);

  const createStore = require('../../app/todoapp/store/configureStore');
  ReactDOM.render(
    <Root store={createStore(initialState)} />,
    document.querySelector('#root')
  );
});
