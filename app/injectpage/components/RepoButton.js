import React, { Component } from 'react';

class RepoButton extends Component {

  render() {
    return (
      <a
        className="inject-react-example-repo-button"
        href="https://github.com/jhen0409/react-chrome-extension-boilerplate" target="_blank">
        view repo
      </a>
    );
  }
}

export default RepoButton;