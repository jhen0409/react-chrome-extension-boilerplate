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
    const elems = yield findList(driver);
    return { elem: elems[0], length: elems.length };
  });
}

function editTodo(driver, index, key) {
  return co(function *() {
    let elems = yield findList(driver);
    const label = elems[index].findElement(webdriver.By.tagName('label'));
    // dbl click to enable textarea
    yield driver.actions().doubleClick(label).perform();
    // typing & enter
    driver.actions().sendKeys(key + webdriver.Key.RETURN).perform();

    elems = yield findList(driver);
    return { elem: elems[index], length: elems.length };
  });
}

function completeTodo(driver, index) {
  return co(function *() {
    let elems = yield findList(driver);
    elems[index].findElement(webdriver.By.className('toggle')).click();
    elems = yield findList(driver);
    return { elem: elems[index], length: elems.length };
  });
}

function deleteTodo(driver, index) {
  return co(function *() {
    let elems = yield findList(driver);
    driver.executeScript(
      `document.querySelectorAll('.todo-list > li')[${index}]
        .getElementsByClassName('destroy')[0].style.display = 'block'`
    );
    elems[index].findElement(webdriver.By.className('destroy')).click();
    elems = yield findList(driver);
    return { length: elems.length };
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
      const { elem, length } = yield addTodo(this.driver, 'Add tests');
      expect(length).to.equal(2);
      const text = yield elem.findElement(webdriver.By.tagName('label')).getText();
      expect(text).to.equal('Add tests');
      done();
    }.bind(this)).catch(done);
  });

  it('should can edit todo', function(done) {
    co(function *() {
      const { elem, length } = yield editTodo(this.driver, 0, 'Ya ');
      expect(length).to.equal(2);
      const text = yield elem.findElement(webdriver.By.tagName('label')).getText();
      expect(text).to.equal('Ya Add tests');
      done();
    }.bind(this)).catch(done);
  });

  it('should can complete todo', function(done) {
    co(function *() {
      const { elem, length } = yield completeTodo(this.driver, 0);
      expect(length).to.equal(2);
      const className = yield elem.getAttribute('class');
      expect(className).to.equal('completed');
      done();
    }.bind(this)).catch(done);
  });

  it('should can complete all todos', function(done) {
    co(function *() {
      this.driver.findElement(webdriver.By.className('toggle-all')).click();
      const elems = yield findList(this.driver);
      const classNames = yield Promise.all(elems.map((elem) => elem.getAttribute('class')));
      expect(classNames.every((name) => name === 'completed')).to.equal(true);
      done();
    }.bind(this)).catch(done);
  });

  it('should can delete todo', function(done) {
    co(function *() {
      const { length } = yield deleteTodo(this.driver, 0);
      expect(length).to.equal(1);
      done();
    }.bind(this)).catch(done);
  });

  it('should can clear completed todos if completed todos count > 0', function(done) {
    co(function *() {
      // current todo count: 1
      yield addTodo(this.driver, 'Add 1');
      const { length } = yield addTodo(this.driver, 'Add 2');
      expect(length).to.equal(3);

      yield completeTodo(this.driver, 0);
      this.driver.findElement(webdriver.By.className('clear-completed')).click();
      const elems = yield findList(this.driver);
      const classNames = yield Promise.all(elems.map((elem) => elem.getAttribute('class')));
      expect(classNames.every((name) => name !== 'completed')).to.equal(true);
      done();
    }.bind(this)).catch(done);
  });

  it('should cannot clear completed todos if completed todos count = 0', function(done) {
    co(function *() {
      const elems = yield this.driver.findElements(webdriver.By.className('clear-completed'));
      expect(elems.length).to.equal(0);
      done();
    }.bind(this)).catch(done);
  });

  it('should can filter active todos', function(done) {
    co(function *() {
      // current todo count: 2
      yield addTodo(this.driver, 'Add 1');
      const { length } = yield addTodo(this.driver, 'Add 2');
      expect(length).to.equal(3);

      yield completeTodo(this.driver, 0);
      let elems = yield this.driver.findElements(webdriver.By.css('.filters > li'));
      elems[1].click();
      elems = yield findList(this.driver);
      expect(elems.length).to.equal(2);
      done();
    }.bind(this)).catch(done);
  });

  it('should can filter completed todos', function(done) {
    co(function *() {
      // current todo count: 2
      let elems = yield this.driver.findElements(webdriver.By.css('.filters > li'));
      elems[2].click();
      elems = yield findList(this.driver);
      expect(elems.length).to.equal(1);
      done();
    }.bind(this)).catch(done);
  });
});