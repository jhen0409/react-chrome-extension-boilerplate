import React, { Component } from 'react';
import TodoApp from './TodoApp';
import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import { devTools, persistState } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { Provider } from 'react-redux';
import * as reducers from '../reducers';
import thunk from 'redux-thunk';
import saveTodos from '../utils/saveTodosMiddleware';

const reducer = combineReducers(reducers);
const middlewares = applyMiddleware(thunk, saveTodos);
let finalCreateStore;
if (__DEVELOPMENT__) {
  finalCreateStore = compose(
    middlewares,
    devTools(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
    createStore
  );
} else {
  finalCreateStore = middlewares(createStore);
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