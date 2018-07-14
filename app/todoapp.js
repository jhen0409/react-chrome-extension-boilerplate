import React from 'react';
import ReactDOM from 'react-dom';
// i18n
import {
  addLocaleData,
  IntlProvider,
} from 'react-intl';


import en from 'react-intl/locale-data/en';
import ko from 'react-intl/locale-data/ko';

import { language, messages } from '../chrome/extension/common/i18n';

import Root from './containers/Root';
import './todoapp.css';

addLocaleData([...en, ...ko]);

chrome.storage.local.get('state', (obj) => {
  const { state } = obj;
  const initialState = JSON.parse(state || '{}');

  const createStore = require('./store/configureStore');

  ReactDOM.render(
    <IntlProvider
      locale={language}
      messages={messages}
    >
      <Root store={createStore(initialState)} />
    </IntlProvider>,
    document.querySelector('#root')
  );
});
