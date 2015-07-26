import * as types from '../constants/ActionTypes';

export function addTodo(text) {
  return {
    type: types.ADD_TODO,
    lastSaveTodos: true,
    text
  };
}

export function deleteTodo(id) {
  return {
    type: types.DELETE_TODO,
    lastSaveTodos: true,
    id
  };
}

export function editTodo(id, text) {
  return {
    type: types.EDIT_TODO,
    lastSaveTodos: true,
    id,
    text
  };
}

export function markTodo(id) {
  return {
    type: types.MARK_TODO,
    lastSaveTodos: true,
    id
  };
}

export function markAll() {
  return {
    type: types.MARK_ALL,
    lastSaveTodos: true
  };
}

export function clearMarked() {
  return {
    type: types.CLEAR_MARKED,
    lastSaveTodos: true
  };
}