import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RepoButton from '../components/RepoButton';

@connect(state => state)
export default class InjectApp extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  render() {
    const { dispatch } = this.props;

    return (
      <div style={{
        textAlign: 'center',
        width: 500,
        fontSize: 25
      }}>
        <p>This is Inject React Example</p>
        <RepoButton />
      </div>
    );
  }
}
