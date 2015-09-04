import React from 'react';
import RepoButton from '../../../app/components/RepoButton';

window.addEventListener('load', () => {
  let injectDOM = document.createElement('div');
  injectDOM.className = 'inject-react-example';
  injectDOM.style.margin = '0 auto';
  injectDOM.style.width = '500px';
  document.body.appendChild(injectDOM);

  React.render(
    <div style={{
      textAlign: 'center',
      width: 500,
      fontSize: 25
    }}>
      <p>This is Inject React Example</p>
      <RepoButton />
    </div>,
    injectDOM
  );
});