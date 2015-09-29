import React from 'react';

window.addEventListener('load', () => {
  let injectDOM = document.createElement('div');
  injectDOM.className = 'inject-react-example';
  injectDOM.style.margin = '0 auto';
  injectDOM.style.width = '500px';
  document.body.appendChild(injectDOM);

  let Root = require('../../../app/injectpage/Root');
  React.render(
    <Root />,
    injectDOM
  );
});