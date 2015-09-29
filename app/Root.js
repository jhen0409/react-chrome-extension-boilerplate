import React, { Component } from 'react';
import TodoApp from './TodoApp';
import { devTools, persistState } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { Provider } from 'react-redux';
import createStore from './configureStore';

const store = createStore(window.state);
delete window.state;

export default class Root extends Component {
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
                <DebugPanel top left bottom>
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