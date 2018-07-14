import React from 'react';
import ReactDOM from 'react-dom';
// i18n
import {
  addLocaleData,
  IntlProvider,
} from 'react-intl';


import en from 'react-intl/locale-data/en';
import ko from 'react-intl/locale-data/ko';

import { language, messages } from './common/i18n';
import InjectApp from './page/InjectApp';

console.log('page script injected.');

addLocaleData([...en, ...ko]);

const targetElem = document.querySelector('body');

const wrapper = document.createElement('div');
targetElem.insertBefore(wrapper, targetElem.firstChild);

ReactDOM.render(
  <IntlProvider
    locale={language}
    messages={messages}
  >
    <InjectApp />
  </IntlProvider>,
  wrapper
);
