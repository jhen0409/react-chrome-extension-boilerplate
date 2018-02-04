import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import style from './TodoTextInput.css';

export default class TodoTextInput extends Component {
  static propTypes = {
    onSave: PropTypes.func.isRequired,
    text: PropTypes.string,
    placeholder: PropTypes.string,
    editing: PropTypes.bool,
    newTodo: PropTypes.bool,
  };
  static defaultProps = {
    text: '',
    placeholder: '',
    editing: false,
    newTodo: false,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      text: this.props.text || '',
    };
  }

  handleSubmit = (evt) => {
    const text = evt.target.value.trim();
    if (evt.which === 13) {
      this.props.onSave(text);
      if (this.props.newTodo) {
        this.setState({ text: '' });
      }
    }
  };

  handleChange = (evt) => {
    this.setState({ text: evt.target.value });
  };

  handleBlur = (evt) => {
    if (!this.props.newTodo) {
      this.props.onSave(evt.target.value);
    }
  };

  render() {
    return (
      <input
        className={classnames({
          [style.edit]: this.props.editing,
          [style.new]: this.props.newTodo,
        })}
        type="text"
        placeholder={this.props.placeholder}
        autoFocus
        value={this.state.text}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onKeyDown={this.handleSubmit}
      />
    );
  }
}
