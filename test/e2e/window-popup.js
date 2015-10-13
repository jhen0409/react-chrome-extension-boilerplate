import webdriver from 'selenium-webdriver';
import { expect } from 'chai';
import { check } from '../func';

function addTodo(driver, key) {
  // add todo
  driver.findElement(webdriver.By.className('new-todo')).sendKeys(key + webdriver.Key.RETURN);
  return driver.findElements(
    webdriver.By.css('.todo-list > li')
  ).then((elems) => ({ elem: elems[0], length: elems.length }));
}

function editTodo(driver, index, key) {
  return driver.findElements(webdriver.By.css('.todo-list > li')).then(elems => {
    // double click label
    const label = elems[index].findElement(webdriver.By.tagName('label'));
    return driver.actions().doubleClick(label).perform();
  }).then(() => {
    // edit todo
    driver.actions().sendKeys(key + webdriver.Key.RETURN).perform();
    return driver.findElements(
      webdriver.By.css('.todo-list > li')
    ).then((elems) => ({ elem: elems[index], length: elems.length }));
  });
}

function completeTodo(driver, index) {
  return driver.findElements(webdriver.By.css('.todo-list > li')).then(elems => {
    // complete todo
    elems[index].findElement(webdriver.By.className('toggle')).click();
    return ({ elem: elems[index], length: elems.length });
  });
}

function deleteTodo(dirver, index) {

}

describe('window (popup) page', function() {

  before(function(done) {
    this.timeout(6000);
    this.driver = new webdriver.Builder()
      .usingServer('http://localhost:9515')
      .withCapabilities({
        chromeOptions: {
          args: [ 'load-extension=./build' ]
        }
      })
      .forBrowser('chrome')
      .build();
    this.driver.get('chrome://extensions-frame').then(() =>
      this.driver.findElements(webdriver.By.className('extension-list-item-wrapper'))
    ).then(elems =>
      elems[1].getAttribute('id')
    ).then(id =>
      this.driver.get(`chrome-extension://${id}/window.html`).then(done)
    );
  });

  after(function(done) {
    this.timeout(15000);
    this.driver.quit().then(done);
  });

  it('should open Redux TodoMVC Example', function(done) {
    this.driver.getTitle().then((title) => {
      expect(title).to.equal('Redux TodoMVC Example');
      done();
    });
  });

  it('should can add todo', function(done) {
    addTodo(this.driver, 'Add tests').then(({ elem, length }) => {
      expect(length).to.equal(2);
      return elem.findElement(webdriver.By.tagName('label')).getText();
    }).then(text => {
      expect(text).to.equal('Add tests');
      done();
    });
  });

  it('should can edit todo', function(done) {
    editTodo(this.driver, 0, 'Ya ').then(({ elem, length }) => {
      expect(length).to.equal(2);
      return elem.findElement(webdriver.By.tagName('label')).getText();
    }).then(text => {
      expect(text).to.equal('Ya Add tests');
      done();
    });
  });

  it('should can complete todo', function(done) {
    completeTodo(this.driver, 0).then(({ elem, length }) => {
      expect(length).to.equal(2);
      return elem.getAttribute('class');
    }).then(className => {
      expect(className).to.equal('completed');
      done();
    });
  });

  it('should can complete all todos', function(done) {
    // TODO
    done();
  });

  it('should can delete todo', function(done) {
    // TODO
    done();
  });

  it('should can clear completed todos', function(done) {
    // TODO
    done();
  });

  it('should can filter active todos', function(done) {
    // TODO
    done();
  });

  it('should can filter completed todos', function(done) {
    // TODO
    done();
  });
});