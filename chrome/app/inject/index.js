import React from 'react';
import ReactDOM from 'react-dom';
import Root from '../../../app/injectpage/containers/Root';

window.addEventListener('load', () => {
  const injectDOM = document.createElement('div');
  injectDOM.className = 'inject-react-example';
  injectDOM.style.margin = '0 auto';
  injectDOM.style.width = '500px';
  document.body.appendChild(injectDOM);

  const createStore = require('../../../app/injectpage/store/configureStore');
  ReactDOM.render(
    <Root store={createStore()} />,
    injectDOM
  );
});
