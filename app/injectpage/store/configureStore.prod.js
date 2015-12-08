import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import rootReducer from './reducers';
import thunk from 'redux-thunk';

const middlewares = applyMiddleware(thunk);
let finalCreateStore = compose(middlewares)(createStore);

export default function(initialState) {
  return finalCreateStore(rootReducer, initialState);
}