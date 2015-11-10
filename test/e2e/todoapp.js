import co from 'co';
import webdriver from 'selenium-webdriver';
import { expect } from 'chai';
import { check } from '../func';

function findList(driver) {
  return driver.findElements(webdriver.By.css('.todo-list > li'));
}

function addTodo(driver, key) {
  // add todo
  return co(function *() {
    driver.findElement(webdriver.By.className('new-todo')).sendKeys(key + webdriver.Key.RETURN);
    const todos = yield findList(driver);
    return { todo: todos[0], count: todos.length };
  });
}

function editTodo(driver, index, key) {
  return co(function *() {
    let todos = yield findList(driver);
    const label = todos[index].findElement(webdriver.By.tagName('label'));
    // dbl click to enable textarea
    yield driver.actions().doubleClick(label).perform();
    // typing & enter
    driver.actions().sendKeys(key + webdriver.Key.RETURN).perform();

    todos = yield findList(driver);
    return { todo: todos[index], count: todos.length };
  });
}

function completeTodo(driver, index) {
  return co(function *() {
    let todos = yield findList(driver);
    todos[index].findElement(webdriver.By.className('toggle')).click();
    todos = yield findList(driver);
    return { todo: todos[index], count: todos.length };
  });
}

function deleteTodo(driver, index) {
  return co(function *() {
    let todos = yield findList(driver);
    driver.executeScript(
      `document.querySelectorAll('.todo-list > li')[${index}]
        .getElementsByClassName('destroy')[0].style.display = 'block'`
    );
    todos[index].findElement(webdriver.By.className('destroy')).click();
    todos = yield findList(driver);
    return { count: todos.length };
  });
}

describe('window (popup) page', function() {
  this.timeout(15000);

  before(function(done) {
    this.driver = new webdriver.Builder()
      .usingServer('http://localhost:9515')
      .withCapabilities({
        chromeOptions: {
          args: [ 'load-extension=./build' ]
        }
      })
      .forBrowser('chrome')
      .build();
    co(function *() {
      yield this.driver.get('chrome://extensions-frame');
      const elems = yield this.driver.findElements(webdriver.By.className('extension-list-item-wrapper'));
      const extensionId = yield elems[1].getAttribute('id');
      yield this.driver.get(`chrome-extension://${extensionId}/window.html`);
      done();
    }.bind(this)).catch(done);
  });

  after(function(done) {
    this.driver.quit().then(done);
  });

  it('should open Redux TodoMVC Example', function(done) {
    co(function *() {
      const title = yield this.driver.getTitle();
      expect(title).to.equal('Redux TodoMVC Example');
      done();
    }.bind(this)).catch(done);
  });

  it('should can add todo', function(done) {
    co(function *() {
      const { todo, count } = yield addTodo(this.driver, 'Add tests');
      expect(count).to.equal(2);
      const text = yield todo.findElement(webdriver.By.tagName('label')).getText();
      expect(text).to.equal('Add tests');
      done();
    }.bind(this)).catch(done);
  });

  it('should can edit todo', function(done) {
    co(function *() {
      const { todo, count } = yield editTodo(this.driver, 0, 'Ya ');
      expect(count).to.equal(2);
      const text = yield todo.findElement(webdriver.By.tagName('label')).getText();
      expect(text).to.equal('Ya Add tests');
      done();
    }.bind(this)).catch(done);
  });

  it('should can complete todo', function(done) {
    co(function *() {
      const { todo, count } = yield completeTodo(this.driver, 0);
      expect(count).to.equal(2);
      const className = yield todo.getAttribute('class');
      expect(className).to.equal('completed');
      done();
    }.bind(this)).catch(done);
  });

  it('should can complete all todos', function(done) {
    co(function *() {
      this.driver.findElement(webdriver.By.className('toggle-all')).click();
      const todos = yield findList(this.driver);
      const classNames = yield Promise.all(todos.map((todo) => todo.getAttribute('class')));
      expect(classNames.every((name) => name === 'completed')).to.equal(true);
      done();
    }.bind(this)).catch(done);
  });

  it('should can delete todo', function(done) {
    co(function *() {
      const { count } = yield deleteTodo(this.driver, 0);
      expect(count).to.equal(1);
      done();
    }.bind(this)).catch(done);
  });

  it('should can clear completed todos if completed todos count > 0', function(done) {
    co(function *() {
      // current todo count: 1
      yield addTodo(this.driver, 'Add 1');
      const { count } = yield addTodo(this.driver, 'Add 2');
      expect(count).to.equal(3);

      yield completeTodo(this.driver, 0);
      this.driver.findElement(webdriver.By.className('clear-completed')).click();
      const todos = yield findList(this.driver);
      const classNames = yield Promise.all(todos.map((todo) => todo.getAttribute('class')));
      expect(classNames.every((name) => name !== 'completed')).to.equal(true);
      done();
    }.bind(this)).catch(done);
  });

  it('should cannot clear completed todos if completed todos count = 0', function(done) {
    co(function *() {
      const todos = yield this.driver.findElements(webdriver.By.className('clear-completed'));
      expect(todos.length).to.equal(0);
      done();
    }.bind(this)).catch(done);
  });

  it('should can filter active todos', function(done) {
    co(function *() {
      // current todo count: 2
      yield addTodo(this.driver, 'Add 1');
      const { count } = yield addTodo(this.driver, 'Add 2');
      expect(count).to.equal(3);

      yield completeTodo(this.driver, 0);
      let todos = yield this.driver.findElements(webdriver.By.css('.filters > li'));
      todos[1].click();
      todos = yield findList(this.driver);
      expect(todos.length).to.equal(2);
      done();
    }.bind(this)).catch(done);
  });

  it('should can filter completed todos', function(done) {
    co(function *() {
      // current todo count: 2
      let todos = yield this.driver.findElements(webdriver.By.css('.filters > li'));
      todos[2].click();
      todos = yield findList(this.driver);
      expect(todos.length).to.equal(1);
      done();
    }.bind(this)).catch(done);
  });
});