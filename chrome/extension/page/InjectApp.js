import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dock from 'react-dock';
import { injectIntl } from 'react-intl';

class InjectApp extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { isVisible: false };
  }

  buttonOnClick = () => {
    const { isVisible } = this.state;
    this.setState({ isVisible: !isVisible });
  };

  render() {
    const { intl } = this.props;
    const { isVisible } = this.state;

    return (
      <div className="todoApp">
        <button type="button" onClick={this.buttonOnClick}>
          {intl.formatMessage({ id: 'btnOpen' })}
        </button>
        <Dock
          position="bottom"
          dimMode="transparent"
          defaultSize={0.4}
          isVisible={isVisible}
        >
          If you want to run your react application in page context,<br />
          Add your React Component from here.
        </Dock>
      </div>
    );
  }
}

export default injectIntl(InjectApp);
