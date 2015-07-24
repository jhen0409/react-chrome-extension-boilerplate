import React, { Component } from 'react';
import TodoApp from './TodoApp';
import { createStore, combineReducers, compose } from 'redux';
import { devTools, persistState } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { Provider } from 'react-redux';
import * as reducers from '../reducers';

const reducer = combineReducers(reducers);
let finalCreateStore;

let isDev = typeof __DEVELOPMENT__ !== 'undefined' && __DEVELOPMENT__;
if (isDev) {
  finalCreateStore = compose(
    devTools(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
    createStore
  );
} else {
  finalCreateStore = createStore;
}

const store = finalCreateStore(reducer);

export default class App extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          {() => <TodoApp /> }
        </Provider>
        {
          (() => {
            if (isDev) {
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