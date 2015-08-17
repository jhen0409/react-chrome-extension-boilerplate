import React, { Component } from 'react';
import TodoApp from './TodoApp';
import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import { devTools, persistState } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { Provider } from 'react-redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import storage from '../utils/storage';

const middlewares = applyMiddleware(thunk);
let finalCreateStore;
if (__DEVELOPMENT__) {
  finalCreateStore = compose(
    middlewares,
    storage(),
    devTools(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
    createStore
  );
} else {
  finalCreateStore = compose(
    middlewares,
    storage(),
    createStore
  );
}

const store = finalCreateStore(rootReducer, window.state);
delete window.state;

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