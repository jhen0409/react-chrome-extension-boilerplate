import * as ActionTypes from '../constants/ActionTypes';

let initialState = window.todos ||
  [{
    text: 'Use Redux',
    marked: false,
    id: 0
  }]
;

const actionsMap = {
  [ActionTypes.ADD_TODO]: (state, action) => {
    return [{
      id: (state.length === 0) ? 0 : state[0].id + 1,
      marked: false,
      text: action.text
    }, ...state];
  },
  [ActionTypes.DELETE_TODO]: (state, action) => {
    return state.filter(todo =>
      todo.id !== action.id
    );
  },
  [ActionTypes.EDIT_TODO]: (state, action) => {
    return state.map(todo =>
      todo.id === action.id ?
        { ...todo, text: action.text } :
        todo
    );
  },
  [ActionTypes.MARK_TODO]: (state, action) => {
    return state.map(todo =>
      todo.id === action.id ?
        { ...todo, marked: !todo.marked } :
        todo
    );
  },
  [ActionTypes.MARK_ALL]: (state, action) => {
    const areAllMarked = state.every(todo => todo.marked);
    return state.map(todo => ({
      ...todo,
      marked: !areAllMarked
    }));
  },
  [ActionTypes.CLEAR_MARKED]: (state, action) => {
    return state.filter(todo => !todo.marked);
  }
};

function saveTodos(state) {
  chrome.storage.local.set({ todos: JSON.stringify(state) });
  let len = state.filter((todo) => !todo.marked).length;
  len = len > 0 ? len.toString() : '';
  chrome.browserAction.setBadgeText({ text: len });
}

export default function todos(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;

  let newState = reduceFn(state, action);
  saveTodos(newState);
  return newState;
}