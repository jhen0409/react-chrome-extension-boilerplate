/*
 * issue: Not showing up when inspecting a Chrome app
 * https://github.com/facebook/react-devtools/issues/91
 */

Object.defineProperty(
  window, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
    value: {
      inject: function(runtime) { this._reactRuntime = runtime; },
      getSelectedInstance: null,
      Overlay: null
    }
  }
);