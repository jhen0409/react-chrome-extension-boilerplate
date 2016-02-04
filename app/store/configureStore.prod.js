import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import storage from '../utils/storage';

const middlewares = applyMiddleware(thunk);
let finalCreateStore = compose(
  middlewares,
  storage()
)(createStore);

export default function(initialState) {
  return finalCreateStore(rootReducer, initialState);
}
