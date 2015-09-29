import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import { devTools, persistState } from 'redux-devtools';
import rootReducer from './reducers/index';
import thunk from 'redux-thunk';
import storage from './utils/storage';

const middlewares = applyMiddleware(thunk);
let finalCreateStore;
if (__DEVELOPMENT__) {
  finalCreateStore = compose(
    middlewares,
    storage(),
    devTools(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
  )(createStore);
} else {
  finalCreateStore = compose(
    middlewares,
    storage()
  )(createStore);
}

export default function(initialState) {
  const store = finalCreateStore(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers/index');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}