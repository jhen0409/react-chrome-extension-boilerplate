import ExecutionEnvironment from 'react/lib/ExecutionEnvironment';
import jsdom from 'mocha-jsdom';

export function jsdomReact() {
  jsdom();
  ExecutionEnvironment.canUseDOM = true;
}

export function check(done, func) {
  try {
    func();
  } catch (ex) {
    done(ex);
  }
}