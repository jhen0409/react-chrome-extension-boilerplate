import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import { devTools, persistState } from 'redux-devtools';
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import storage from '../utils/storage';

let composes = [
  applyMiddleware(
    thunk,
    logger({ level: 'info' })
  ),
  storage()
];
if (process.env.DEVTOOLS_EXT && window.devToolsExtension) {
  composes.push(window.devToolsExtension());
} else if (process.env.DEVTOOLS) {
  composes = [
    ...composes,
    DevTools.instrument(),
    persistState(
      window.location.href.match(
        /[?&]debug_session=([^&]+)\b/
      )
    )
  ];
}
const finalCreateStore = compose(...composes)(createStore);

export default function(initialState) {
  const store = finalCreateStore(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
