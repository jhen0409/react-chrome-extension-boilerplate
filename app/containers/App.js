import React, { Component } from 'react';
import TodoApp from './TodoApp';
import { createStore, combineReducers, compose } from 'redux';
import { devTools, persistState } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { Provider } from 'react-redux';
import * as reducers from '../reducers';

const reducer = combineReducers(reducers);
let finalCreateStore;

if (__DEVELOPMENT__) {
  finalCreateStore = compose(
    devTools(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
    createStore
  );
} else {
  finalCreateStore = createStore;
}

const store = finalCreateStore(reducer, window.state);
window.state = null;

export default class App extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          {() => <TodoApp /> }
        </Provider>
        {
          (() => {
            if (__DEVELOPMENT__) {
              return (
                <DebugPanel top right bottom>
                  <DevTools store={store}
                            monitor={LogMonitor} />
                </DebugPanel>
              );
            }
          })()
        }
      </div>
    );
  }
}